import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScrollProgress, useReducedMotion } from "../hooks/index";
import { bridge } from "../utils/bridge";

// ─── GLSL ─────────────────────────────────────────────────────────────────────

const PARTICLE_VERT = `
uniform float uTime;
uniform float uScrollVel;
attribute vec3 aColor;
attribute float aSize;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  float dist = -mvPos.z;
  float pulse = 0.65 + sin(uTime * 1.8 + position.x * 0.018 + position.z * 0.012) * 0.35;
  gl_PointSize = clamp(
    (aSize * pulse * 340.0 * (1.0 + uScrollVel * 2.2)) / dist,
    1.2, 18.0
  );
  vAlpha = clamp(1.0 - dist / 850.0, 0.0, 1.0) * pulse;
  gl_Position = projectionMatrix * mvPos;
}
`;

const PARTICLE_FRAG = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float core = 1.0 - smoothstep(0.0, 0.18, d);
  float halo = (1.0 - smoothstep(0.18, 0.5, d)) * 0.28;
  float a = (core + halo) * vAlpha;

  // Overbrightened hot center
  vec3 col = mix(vColor * 2.4, vColor, smoothstep(0.0, 0.22, d));
  gl_FragColor = vec4(col, a);
}
`;

const LINE_VERT = `
attribute vec3 aColor;
varying vec3 vColor;
varying float vDepth;

void main() {
  vColor = aColor;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mvPos.z;
  gl_Position = projectionMatrix * mvPos;
}
`;

const LINE_FRAG = `
varying vec3 vColor;
varying float vDepth;
uniform float uScrollVel;

void main() {
  float a = 0.55 * (1.0 - smoothstep(180.0, 680.0, vDepth));
  a *= 0.7 + uScrollVel * 0.55;
  gl_FragColor = vec4(vColor, a);
}
`;

const HUB_WIRE_VERT = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HUB_WIRE_FRAG = `
uniform vec3 uColor;
uniform float uTime;
uniform float uActive;
uniform float uOpacity;
uniform float uPhase;

void main() {
  // Screen-space horizontal scan line scrolling through the shape
  float scan = fract(gl_FragCoord.y / 580.0 - uTime * 0.32 + uPhase);
  float sl = smoothstep(0.0, 0.05, scan) * smoothstep(0.10, 0.05, scan);
  float a = uOpacity + sl * 0.42 * uActive;
  vec3 col = uColor * (1.0 + sl * uActive * 0.9);
  gl_FragColor = vec4(col, a);
}
`;

const GLOW_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GLOW_FRAG = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uTime;
uniform float uActive;
uniform float uProximity;
uniform float uSeed;

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p);
  if (d > 0.5) discard;

  // Soft diffuse glow
  float soft = exp(-d * d * 20.0) * 0.45;

  // Pulsing ring
  float ringR = 0.31 + sin(uTime * 0.55 + uSeed) * 0.025 * uActive;
  float ring  = smoothstep(ringR - 0.022, ringR, d) * smoothstep(ringR + 0.042, ringR, d);
  float ringA = ring * (0.5 + sin(uTime * 2.8 + uSeed) * 0.5) * uActive;

  float vis = smoothstep(0.0, 0.4, uProximity) * 0.7 + uActive * 0.55;
  float intensity = (soft + ringA * 0.95) * vis;
  if (intensity < 0.004) discard;

  gl_FragColor = vec4(uColor * (1.0 + soft * 1.8 * uActive), intensity);
}
`;

const FLOW_VERT = `
attribute float aT;
varying float vT;
void main() {
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FLOW_FRAG = `
uniform float uTime;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
varying float vT;

vec3 pathCol(float t) {
  float s = clamp(t, 0.0, 0.9999) * 3.0;
  float f = fract(s);
  int idx = int(s);
  if (idx == 0) return mix(uC0, uC1, f);
  if (idx == 1) return mix(uC1, uC2, f);
  return mix(uC2, uC3, f);
}

void main() {
  vec3 col = pathCol(vT);

  // Two energy pulses at different speeds
  float t1 = fract(vT - uTime * 0.13);
  float t2 = fract(vT - uTime * 0.08 + 0.55);
  float g1 = exp(-pow(min(t1, 1.0 - t1) * 44.0, 2.0));
  float g2 = exp(-pow(min(t2, 1.0 - t2) * 28.0, 2.0)) * 0.5;

  float a = 0.055 + g1 * 0.9 + g2 * 0.5;
  vec3 finalCol = mix(col * 0.45, col * 3.0, g1 + g2 * 0.7);
  gl_FragColor = vec4(finalCol, min(a, 1.0));
}
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const HUBS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(-220, 110, -380),
  new THREE.Vector3(240, -110, -760),
  new THREE.Vector3(-20, 130, -1140),
];

const CAM_POS = [
  new THREE.Vector3(30, 70, 270),
  new THREE.Vector3(-190, 180, -120),
  new THREE.Vector3(275, -50, -510),
  new THREE.Vector3(20, 200, -890),
];

const HUB_COLORS = [0x00d9ff, 0x7b2fff, 0xff6b35, 0x00ffaa];

const HUB_RGB = [
  [0.0,   0.851, 1.0  ],
  [0.482, 0.184, 1.0  ],
  [1.0,   0.42,  0.208],
  [0.0,   1.0,   0.667],
];

const TOTAL     = 800;
const PER_HUB   = 40;
const SCATTER   = TOTAL - HUBS.length * PER_HUB;
const HUB_R     = 110;
const LINK_DIST = 75;
const LINK_SQ   = LINK_DIST * LINK_DIST;
const MAX_LINKS = 800;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Scene() {
  const canvasRef = useRef(null);
  const scrollRef = useScrollProgress();
  const noMotion  = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width    = window.innerWidth;
    const isMobile = width < 640;
    const isTablet = width < 1024;

    let activeTotal    = TOTAL;
    let activeMaxLinks = MAX_LINKS;
    if (isMobile) {
      activeTotal    = Math.floor(TOTAL     * 0.35);
      activeMaxLinks = Math.floor(MAX_LINKS * 0.3);
    } else if (isTablet) {
      activeTotal    = Math.floor(TOTAL     * 0.65);
      activeMaxLinks = Math.floor(MAX_LINKS * 0.6);
    }

    // ── Renderer ──────────────────────────────────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setClearColor(0x04040a, 1);
    } catch (e) {
      console.warn("WebGL not supported, running fallback loop for UI.");
      let raf;
      let smoothRaw = 0;
      const fallbackTick = () => {
        raf = requestAnimationFrame(fallbackTick);
        const sp  = scrollRef.current;
        const raw = sp * (HUBS.length - 1);
        const fi  = Math.min(Math.floor(raw), HUBS.length - 2);
        const frac = raw - fi;
        const c0 = HUB_RGB[fi], c1 = HUB_RGB[fi + 1];
        const ar = c0[0] + (c1[0] - c0[0]) * frac;
        const ag = c0[1] + (c1[1] - c0[1]) * frac;
        const ab = c0[2] + (c1[2] - c0[2]) * frac;
        const root = document.documentElement;
        const hr = Math.round(ar * 255), hg = Math.round(ag * 255), hb = Math.round(ab * 255);
        root.style.setProperty('--accent',     `rgb(${hr},${hg},${hb})`);
        root.style.setProperty('--accent-rgb', `${hr},${hg},${hb}`);
        const spd = noMotion ? 1 : 0.02;
        smoothRaw += (raw - smoothRaw) * spd;
        for (let i = 0; i < HUBS.length; i++) {
          const absP = Math.abs(smoothRaw - i);
          const op   = Math.max(0, Math.min(1, 1.2 - absP * 3.5));
          const ty   = (smoothRaw - i) * 40;
          root.style.setProperty(`--opacity-${i}`,   op);
          root.style.setProperty(`--translate-${i}`, `${ty}px`);
          root.style.setProperty(`--events-${i}`,    absP < 0.35 ? 'all' : 'none');
        }
      };
      fallbackTick();
      return () => {
        cancelAnimationFrame(raf);
        const root = document.documentElement;
        root.style.setProperty('--accent',     '#00d9ff');
        root.style.setProperty('--accent-rgb', '0,217,255');
      };
    }

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, 1, 0.5, 3000);
    camera.position.copy(CAM_POS[0]);
    scene.fog = new THREE.FogExp2(0x04040a, 0.0011);

    // ── Particle geometry ────────────────────────────────────────────────────
    const pos   = new Float32Array(TOTAL * 3);
    const vel   = new Float32Array(TOTAL * 3);
    const col   = new Float32Array(TOTAL * 3);
    const sizes = new Float32Array(TOTAL);

    let wi = 0;

    for (let h = 0; h < HUBS.length; h++) {
      const hub = HUBS[h];
      for (let j = 0; j < PER_HUB; j++, wi++) {
        const r     = Math.cbrt(Math.random()) * HUB_R;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(Math.random() * 2 - 1);
        pos[wi * 3]     = hub.x + r * Math.sin(phi) * Math.cos(theta);
        pos[wi * 3 + 1] = hub.y + r * Math.sin(phi) * Math.sin(theta);
        pos[wi * 3 + 2] = hub.z + r * Math.cos(phi);
        vel[wi * 3]     = (Math.random() - 0.5) * 0.065;
        vel[wi * 3 + 1] = (Math.random() - 0.5) * 0.05;
        vel[wi * 3 + 2] = (Math.random() - 0.5) * 0.04;
        // Static fallback colors (overwritten per-frame when motion is enabled)
        col[wi * 3]     = HUB_RGB[h][0] * 0.25;
        col[wi * 3 + 1] = HUB_RGB[h][1] * 0.25;
        col[wi * 3 + 2] = HUB_RGB[h][2] * 0.25;
        sizes[wi] = 0.016 + Math.random() * 0.02;
      }
    }

    for (let i = 0; i < SCATTER; i++, wi++) {
      const seg  = Math.floor(Math.random() * (HUBS.length - 1));
      const t    = Math.random();
      const from = HUBS[seg], to = HUBS[seg + 1];
      pos[wi * 3]     = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 340;
      pos[wi * 3 + 1] = from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 240;
      pos[wi * 3 + 2] = from.z + (to.z - from.z) * t + (Math.random() - 0.5) * 160;
      vel[wi * 3]     = (Math.random() - 0.5) * 0.12;
      vel[wi * 3 + 1] = (Math.random() - 0.5) * 0.08;
      vel[wi * 3 + 2] = (Math.random() - 0.5) * 0.06;
      col[wi * 3]     = 0.06;
      col[wi * 3 + 1] = 0.12;
      col[wi * 3 + 2] = 0.18;
      sizes[wi] = 0.009 + Math.random() * 0.013;
    }

    const ptGeom    = new THREE.BufferGeometry();
    const posAttr   = new THREE.BufferAttribute(pos,   3);
    const aColAttr  = new THREE.BufferAttribute(col,   3);
    const aSizeAttr = new THREE.BufferAttribute(sizes, 1);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    aColAttr.setUsage(THREE.DynamicDrawUsage);
    ptGeom.setAttribute('position', posAttr);
    ptGeom.setAttribute('aColor',   aColAttr);
    ptGeom.setAttribute('aSize',    aSizeAttr);

    const ptMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uScrollVel: { value: 0 },
      },
      vertexShader:   PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    const points = new THREE.Points(ptGeom, ptMat);
    scene.add(points);

    // ── Connection lines ─────────────────────────────────────────────────────
    const lpArr = new Float32Array(MAX_LINKS * 6);
    const lcArr = new Float32Array(MAX_LINKS * 6);
    const lGeom = new THREE.BufferGeometry();
    const lpA   = new THREE.BufferAttribute(lpArr, 3);
    const lcA   = new THREE.BufferAttribute(lcArr, 3);
    lpA.setUsage(THREE.DynamicDrawUsage);
    lcA.setUsage(THREE.DynamicDrawUsage);
    lGeom.setAttribute('position', lpA);
    lGeom.setAttribute('aColor',   lcA);
    lGeom.setDrawRange(0, 0);

    const lMat = new THREE.ShaderMaterial({
      uniforms: { uScrollVel: { value: 0 } },
      vertexShader:   LINE_VERT,
      fragmentShader: LINE_FRAG,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    const lineSegs = new THREE.LineSegments(lGeom, lMat);
    scene.add(lineSegs);

    // ── Path curves ──────────────────────────────────────────────────────────
    const hubCurve = new THREE.CatmullRomCurve3(HUBS,    false, 'catmullrom', 0.8);
    const camCurve = new THREE.CatmullRomCurve3(CAM_POS, false, 'catmullrom', 0.8);

    // ── Animated flow line  ───────────────────────────────────────────────────
    const flowPts = hubCurve.getPoints(300);
    const fPosBuf = [];
    const fTBuf   = [];
    flowPts.forEach((p, i) => {
      fPosBuf.push(p.x, p.y, p.z);
      fTBuf.push(i / (flowPts.length - 1));
    });
    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute('position', new THREE.Float32BufferAttribute(fPosBuf, 3));
    flowGeo.setAttribute('aT',       new THREE.Float32BufferAttribute(fTBuf, 1));
    const flowUniforms = {
      uTime: { value: 0 },
      uC0:   { value: new THREE.Vector3(...HUB_RGB[0]) },
      uC1:   { value: new THREE.Vector3(...HUB_RGB[1]) },
      uC2:   { value: new THREE.Vector3(...HUB_RGB[2]) },
      uC3:   { value: new THREE.Vector3(...HUB_RGB[3]) },
    };
    const flowMat = new THREE.ShaderMaterial({
      uniforms:       flowUniforms,
      vertexShader:   FLOW_VERT,
      fragmentShader: FLOW_FRAG,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    const flowLine = new THREE.Line(flowGeo, flowMat);
    flowLine.visible = !noMotion;
    scene.add(flowLine);

    // ── Hub node meshes ──────────────────────────────────────────────────────
    const hubMeshes = HUBS.map((hub, i) => {
      const group    = new THREE.Group();
      const threeCol = new THREE.Color(HUB_COLORS[i]);
      const colVec   = new THREE.Vector3(HUB_RGB[i][0], HUB_RGB[i][1], HUB_RGB[i][2]);

      const matCore = new THREE.MeshPhongMaterial({
        color: 0x04040a, transparent: true, opacity: 0.9, shininess: 100,
      });

      const wireUniforms = {
        uColor:  { value: colVec },
        uTime:   { value: 0 },
        uActive: { value: 0 },
        uOpacity:{ value: 0.2 },
        uPhase:  { value: i * 0.28 },
      };
      const matWire = new THREE.ShaderMaterial({
        uniforms:       wireUniforms,
        vertexShader:   HUB_WIRE_VERT,
        fragmentShader: HUB_WIRE_FRAG,
        wireframe:   true,
        transparent: true,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      });

      const addShape = (geom, y = 0, rx = 0, ry = 0) => {
        const core = new THREE.Mesh(geom, matCore);
        const wire = new THREE.Mesh(geom, matWire);
        wire.scale.setScalar(1.06);
        core.position.y = wire.position.y = y;
        core.rotation.set(rx, ry, 0);
        wire.rotation.set(rx, ry, 0);
        group.add(core, wire);
      };

      if (i === 0) {
        addShape(new THREE.SphereGeometry(25, 12, 12));
        addShape(new THREE.TorusGeometry(35, 1.5, 8, 32), 0, Math.PI / 2);
      } else if (i === 1) {
        addShape(new THREE.ConeGeometry(15, 25, 8),  12.5, Math.PI);
        addShape(new THREE.ConeGeometry(15, 25, 8), -12.5);
      } else if (i === 2) {
        addShape(new THREE.BoxGeometry(16, 16, 16),  20);
        addShape(new THREE.BoxGeometry(16, 16, 16),   0, 0, Math.PI / 4);
        addShape(new THREE.BoxGeometry(16, 16, 16), -20);
      } else {
        addShape(new THREE.ConeGeometry(18, 25, 12), -10);
        addShape(new THREE.CylinderGeometry(6, 6, 20, 12), 12.5);
      }

      // Billboard glow plane
      const glowGeo = new THREE.PlaneGeometry(1, 1);
      const glowUniforms = {
        uColor:     { value: threeCol },
        uTime:      { value: 0 },
        uActive:    { value: 0 },
        uProximity: { value: 0 },
        uSeed:      { value: i * 1.47 },
      };
      const glowMat = new THREE.ShaderMaterial({
        uniforms:       glowUniforms,
        vertexShader:   GLOW_VERT,
        fragmentShader: GLOW_FRAG,
        transparent: true,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
        side:        THREE.DoubleSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.scale.setScalar(100);
      glowMesh.visible = !noMotion;

      const light      = new THREE.PointLight(HUB_COLORS[i], 0, 280);
      const outerGroup = new THREE.Group();
      outerGroup.position.copy(hub);
      outerGroup.add(group, glowMesh, light);
      scene.add(outerGroup);

      return { outerGroup, group, wireUniforms, glowMesh, glowUniforms, light };
    });

    scene.add(new THREE.AmbientLight(0x060618, 1));

    // ── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Mouse ────────────────────────────────────────────────────────────────
    let tMx = 0, tMy = 0, sMx = 0, sMy = 0;
    const onMouse = (e) => {
      tMx = (e.clientX / window.innerWidth  - 0.5) * 2;
      tMy = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ── Camera state ─────────────────────────────────────────────────────────
    const camSmooth  = CAM_POS[0].clone();
    const camTarget  = new THREE.Vector3();
    const lookSmooth = HUBS[0].clone();
    const lookTarget = new THREE.Vector3();
    let smoothRoll = 0;
    const cross    = new THREE.Vector3();

    let raf, time = 0;
    let lastScroll = 0, scrollVel = 0, boost = 0, smoothRaw = 0;

    const unbind = bridge.subscribe((type) => {
      if (type === 'hover') boost = 1.0;
    });

    // ── Tick ─────────────────────────────────────────────────────────────────
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const sp   = scrollRef.current;
      const raw  = sp * (HUBS.length - 1);
      const fi   = Math.min(Math.floor(raw), HUBS.length - 2);
      const frac = raw - fi;

      scrollVel  = Math.abs(sp - lastScroll) * 60;
      lastScroll = sp;
      boost     *= 0.92;

      const c0 = HUB_RGB[fi], c1 = HUB_RGB[fi + 1];
      const ar  = c0[0] + (c1[0] - c0[0]) * frac;
      const ag  = c0[1] + (c1[1] - c0[1]) * frac;
      const ab  = c0[2] + (c1[2] - c0[2]) * frac;

      const root = document.documentElement;
      const hr = Math.round(ar * 255), hg = Math.round(ag * 255), hb = Math.round(ab * 255);
      root.style.setProperty('--accent',     `rgb(${hr},${hg},${hb})`);
      root.style.setProperty('--accent-rgb', `${hr},${hg},${hb}`);

      const t = raw / (HUBS.length - 1);
      camTarget.copy(camCurve.getPoint(t));

      const camTangent    = camCurve.getTangent(t).normalize();
      const distToHub     = Math.abs(raw - Math.round(raw));
      const lookAhead     = 0.01 + Math.sqrt(distToHub * 2) * 0.07;
      const lookAheadT    = Math.min(t + lookAhead, 1.0);
      const aheadCamPoint = camCurve.getPoint(lookAheadT);
      const aheadHubPoint = hubCurve.getPoint(lookAheadT);

      sMx += (tMx - sMx) * 0.03;
      sMy += (tMy - sMy) * 0.03;

      const spd = noMotion ? 1 : 0.02;
      camSmooth.lerp(camTarget, spd);

      smoothRaw += (raw - smoothRaw) * spd;
      for (let i = 0; i < HUBS.length; i++) {
        const absP = Math.abs(smoothRaw - i);
        const op   = Math.max(0, Math.min(1, 1.2 - absP * 3.5));
        const ty   = (smoothRaw - i) * 40;
        root.style.setProperty(`--opacity-${i}`,   op);
        root.style.setProperty(`--translate-${i}`, `${ty}px`);
        root.style.setProperty(`--events-${i}`,    op > 0.2 ? 'auto' : 'none');
      }

      camera.position.copy(camSmooth);
      camera.position.x += sMx * 28;
      camera.position.y += sMy * 18;

      let hubFocus = 1.0 - distToHub * 1.2;
      if (t > 0.8) hubFocus = Math.max(hubFocus, 0.5 + (t - 0.8) * 2.5);
      const targetFocus = Math.max(0, Math.min(hubFocus, 1.0));

      lookTarget.copy(aheadCamPoint).lerp(aheadHubPoint, targetFocus);
      lookSmooth.lerp(lookTarget, spd * 1.2);
      camera.lookAt(lookSmooth);

      const aheadTangent = camCurve.getTangent(lookAheadT).normalize();
      cross.crossVectors(camTangent, aheadTangent);
      const velMult  = Math.min(scrollVel + 0.2, 1.5);
      let targetRoll = -cross.y * 4.0 * velMult;
      targetRoll     = Math.max(-0.45, Math.min(0.45, targetRoll));
      smoothRoll    += (targetRoll - smoothRoll) * 0.03;
      camera.rotateZ(smoothRoll);

      const activeIdx = Math.min(Math.round(raw), HUBS.length - 1);

      if (!noMotion) {
        time += 0.008;

        ptMat.uniforms.uTime.value      = time;
        ptMat.uniforms.uScrollVel.value = Math.min(scrollVel, 1.0);
        lMat.uniforms.uScrollVel.value  = Math.min(scrollVel, 1.0);
        flowUniforms.uTime.value        = time;

        const speedMult = 1 + scrollVel * 4 + boost * 2;
        for (let i = 0; i < activeTotal; i++) {
          pos[i * 3]     += vel[i * 3]     * speedMult;
          pos[i * 3 + 1] += vel[i * 3 + 1] * speedMult;
          pos[i * 3 + 2] += vel[i * 3 + 2] * speedMult;
          if (Math.abs(pos[i * 3])     > 460)  vel[i * 3]     *= -0.82;
          if (Math.abs(pos[i * 3 + 1]) > 300)  vel[i * 3 + 1] *= -0.82;
          if (pos[i * 3 + 2] >   120)           vel[i * 3 + 2] -= 0.014;
          if (pos[i * 3 + 2] < -1280)           vel[i * 3 + 2] += 0.014;
        }

        let lc = 0;
        for (let i = 0; i < activeTotal; i++) {
          let pr = 0.015 + ar * 0.15;
          let pg = 0.04  + ag * 0.15;
          let pb = 0.08  + ab * 0.15;

          for (let h = 0; h < HUBS.length; h++) {
            const hx   = pos[i * 3]     - HUBS[h].x;
            const hy   = pos[i * 3 + 1] - HUBS[h].y;
            const hz   = pos[i * 3 + 2] - HUBS[h].z;
            const glow = Math.max(0, 1 - (hx*hx + hy*hy + hz*hz) / (220*220));
            if (glow > 0) {
              const b = h === activeIdx ? 1.0 : 0.3;
              pr += glow * b * HUB_RGB[h][0];
              pg += glow * b * HUB_RGB[h][1];
              pb += glow * b * HUB_RGB[h][2];
            }
          }
          col[i * 3]     = pr;
          col[i * 3 + 1] = pg;
          col[i * 3 + 2] = pb;

          let nodeLinks = 0;
          if (lc >= activeMaxLinks) continue;
          for (let j = i + 1; j < activeTotal; j++) {
            if (lc >= activeMaxLinks) break;
            if (nodeLinks >= 4) break;
            const ex = pos[i * 3]     - pos[j * 3];
            const ey = pos[i * 3 + 1] - pos[j * 3 + 1];
            const ez = pos[i * 3 + 2] - pos[j * 3 + 2];
            const d2 = ex*ex + ey*ey + ez*ez;
            if (d2 < LINK_SQ) {
              nodeLinks++;
              const s = (1 - d2 / LINK_SQ) * 0.85;
              const k = lc * 6;
              lpArr[k]     = pos[i * 3];     lpArr[k + 1] = pos[i * 3 + 1]; lpArr[k + 2] = pos[i * 3 + 2];
              lpArr[k + 3] = pos[j * 3];     lpArr[k + 4] = pos[j * 3 + 1]; lpArr[k + 5] = pos[j * 3 + 2];
              lcArr[k]     = s * ar * 0.75;  lcArr[k + 1] = s * ag * 0.75;  lcArr[k + 2] = s * ab * 0.75;
              lcArr[k + 3] = s * ar * 0.75;  lcArr[k + 4] = s * ag * 0.75;  lcArr[k + 5] = s * ab * 0.75;
              lc++;
            }
          }
        }

        posAttr.needsUpdate  = true;
        aColAttr.needsUpdate = true;
        lpA.needsUpdate = true;
        lcA.needsUpdate = true;
        lGeom.setDrawRange(0, lc * 2);

        hubMeshes.forEach(({ group, wireUniforms, glowMesh, glowUniforms, light }, i) => {
          const dist      = camera.position.distanceTo(HUBS[i]);
          const proximity = Math.max(0, 1 - dist / 400);
          const isActive  = i === activeIdx;

          group.rotation.y += 0.0025;
          group.rotation.x += 0.0015;
          const pulse = 1 + Math.sin(time * 1.4 + i) * 0.04;
          group.scale.setScalar(pulse);

          wireUniforms.uTime.value    = time;
          wireUniforms.uActive.value  = isActive ? 1.0 : 0.0;
          wireUniforms.uOpacity.value = 0.1 + proximity * 0.35 + (isActive ? 0.15 : 0);

          glowMesh.quaternion.copy(camera.quaternion);
          glowUniforms.uTime.value      = time;
          glowUniforms.uActive.value    = isActive ? 1.0 : 0.0;
          glowUniforms.uProximity.value = proximity;

          light.intensity = isActive
            ? 3.5 + Math.sin(time * 2.2 + i) * 0.8
            : proximity * 1.2;
        });
      }

      renderer.render(scene, camera);
    };

    tick();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      unbind();
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMouse);

      scene.remove(points);
      scene.remove(lineSegs);
      scene.remove(flowLine);

      renderer.dispose();
      ptGeom.dispose();  ptMat.dispose();
      lGeom.dispose();   lMat.dispose();
      flowGeo.dispose(); flowMat.dispose();

      const disposed = new Set();
      hubMeshes.forEach(({ outerGroup }) => {
        scene.remove(outerGroup);
        outerGroup.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach(m => {
              if (!disposed.has(m)) { m.dispose(); disposed.add(m); }
            });
          }
        });
      });
    };
  }, [noMotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
