import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScrollProgress, useReducedMotion } from "../hooks/index";
import { bridge } from "../utils/bridge";

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
  [0.0, 0.851, 1.0],
  [0.482, 0.184, 1.0],
  [1.0, 0.42, 0.208],
  [0.0, 1.0, 0.667],
];

const TOTAL = 1000;
const PER_HUB = 110;
const SCATTER = TOTAL - HUBS.length * PER_HUB;
const HUB_R = 65;

const LINK_DIST = 80;
const LINK_SQ = LINK_DIST * LINK_DIST;
const MAX_LINKS = 550;

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.6)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function Scene() {
  const canvasRef = useRef(null);
  const scrollRef = useScrollProgress();
  const noMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x04040a, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, 1, 0.5, 3000);
    camera.position.copy(CAM_POS[0]);

    scene.fog = new THREE.FogExp2(0x04040a, 0.0011);

    const sprite = makeSprite();

    const pos = new Float32Array(TOTAL * 3);
    const vel = new Float32Array(TOTAL * 3);
    const col = new Float32Array(TOTAL * 3);

    let wi = 0;

    // Hub clusters
    for (let h = 0; h < HUBS.length; h++) {
      const hub = HUBS[h];
      for (let j = 0; j < PER_HUB; j++, wi++) {
        const r = Math.cbrt(Math.random()) * HUB_R;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        pos[wi * 3] = hub.x + r * Math.sin(phi) * Math.cos(theta);
        pos[wi * 3 + 1] = hub.y + r * Math.sin(phi) * Math.sin(theta);
        pos[wi * 3 + 2] = hub.z + r * Math.cos(phi);
        vel[wi * 3] = (Math.random() - 0.5) * 0.065;
        vel[wi * 3 + 1] = (Math.random() - 0.5) * 0.05;
        vel[wi * 3 + 2] = (Math.random() - 0.5) * 0.04;
      }
    }

    // Path scatter particles
    for (let i = 0; i < SCATTER; i++, wi++) {
      const seg = Math.floor(Math.random() * (HUBS.length - 1));
      const t = Math.random();
      const from = HUBS[seg], to = HUBS[seg + 1];
      pos[wi * 3] = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 340;
      pos[wi * 3 + 1] = from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 240;
      pos[wi * 3 + 2] = from.z + (to.z - from.z) * t + (Math.random() - 0.5) * 160;
      vel[wi * 3] = (Math.random() - 0.5) * 0.12;
      vel[wi * 3 + 1] = (Math.random() - 0.5) * 0.08;
      vel[wi * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }

    const ptGeom = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos, 3);
    const colAttr = new THREE.BufferAttribute(col, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    ptGeom.setAttribute("position", posAttr);
    ptGeom.setAttribute("color", colAttr);

    const ptMat = new THREE.PointsMaterial({
      size: 6.5,
      sizeAttenuation: true,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(ptGeom, ptMat));

    // Connection lines
    const lpArr = new Float32Array(MAX_LINKS * 6);
    const lcArr = new Float32Array(MAX_LINKS * 6);
    const lGeom = new THREE.BufferGeometry();
    const lpA = new THREE.BufferAttribute(lpArr, 3);
    const lcA = new THREE.BufferAttribute(lcArr, 3);
    lpA.setUsage(THREE.DynamicDrawUsage);
    lcA.setUsage(THREE.DynamicDrawUsage);
    lGeom.setAttribute("position", lpA);
    lGeom.setAttribute("color", lcA);

    const lMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineSegs = new THREE.LineSegments(lGeom, lMat);
    scene.add(lineSegs);

    const hubCurve = new THREE.CatmullRomCurve3(HUBS, false, 'catmullrom', 0.8);
    const camCurve = new THREE.CatmullRomCurve3(CAM_POS, false, 'catmullrom', 0.8);

    // Visible curved path tube
    const tubeGeo = new THREE.TubeGeometry(hubCurve, 128, 1.2, 6, false);
    const tubeColors = [];
    for (let i = 0; i < tubeGeo.attributes.position.count; i++) {
      const ring = Math.floor(i / 7);
      const t = ring / 128;
      const raw = t * (HUBS.length - 1);
      const fi = Math.min(Math.floor(raw), HUBS.length - 2);
      const frac = raw - fi;
      const c0 = HUB_RGB[fi], c1 = HUB_RGB[fi + 1];
      tubeColors.push(
        c0[0] + (c1[0] - c0[0]) * frac,
        c0[1] + (c1[1] - c0[1]) * frac,
        c0[2] + (c1[2] - c0[2]) * frac
      );
    }
    tubeGeo.setAttribute('color', new THREE.Float32BufferAttribute(tubeColors, 3));
    const tubeMat = new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending, depthWrite: false, wireframe: true
    });
    scene.add(new THREE.Mesh(tubeGeo, tubeMat));

    // Hub node shapes
    const hubMeshes = HUBS.map((hub, i) => {
      const color = HUB_COLORS[i];
      const group = new THREE.Group();
      const wires = [];

      const matCore = new THREE.MeshBasicMaterial({ color: 0x04040a, transparent: true, opacity: 0.85 });
      const matWire = new THREE.MeshBasicMaterial({
        color, wireframe: true, transparent: true, opacity: 0.25,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const matWire2 = new THREE.MeshBasicMaterial({
        color, wireframe: true, transparent: true, opacity: 0.08,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });

      const addShape = (geom, y = 0, rx = 0, ry = 0) => {
        const core = new THREE.Mesh(geom, matCore);
        const wire = new THREE.Mesh(geom, matWire);
        const wire2 = new THREE.Mesh(geom, matWire2);
        wire.scale.setScalar(1.05);
        wire2.scale.setScalar(1.15);

        core.position.y = wire.position.y = wire2.position.y = y;
        core.rotation.set(rx, ry, 0);
        wire.rotation.set(rx, ry, 0);
        wire2.rotation.set(rx, ry, 0);

        group.add(core, wire, wire2);
        wires.push({ wire, wire2 });
      };

      if (i === 0) {
        addShape(new THREE.SphereGeometry(25, 12, 12));
        addShape(new THREE.TorusGeometry(35, 1.5, 8, 32), 0, Math.PI / 2);
      } else if (i === 1) {
        addShape(new THREE.ConeGeometry(15, 25, 8), 12.5, Math.PI);
        addShape(new THREE.ConeGeometry(15, 25, 8), -12.5);
      } else if (i === 2) {
        addShape(new THREE.BoxGeometry(16, 16, 16), 20);
        addShape(new THREE.BoxGeometry(16, 16, 16), 0, 0, Math.PI / 4);
        addShape(new THREE.BoxGeometry(16, 16, 16), -20);
      } else if (i === 3) {
        addShape(new THREE.ConeGeometry(18, 25, 12), -10);
        addShape(new THREE.CylinderGeometry(6, 6, 20, 12), 12.5);
      }

      const light = new THREE.PointLight(color, 0, 280);
      const outerGroup = new THREE.Group();
      outerGroup.position.copy(hub);
      outerGroup.add(group, light);
      scene.add(outerGroup);

      return { outerGroup, group, wires, light, color };
    });

    scene.add(new THREE.AmbientLight(0x060618, 1));

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let tMx = 0, tMy = 0, sMx = 0, sMy = 0;
    const onMouse = (e) => {
      tMx = (e.clientX / window.innerWidth - 0.5) * 2;
      tMy = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const camSmooth = CAM_POS[0].clone();
    const camTarget = new THREE.Vector3();
    const lookSmooth = HUBS[0].clone();
    const lookTarget = new THREE.Vector3();
    const tangentSmooth = new THREE.Vector3(0, 0, -1);
    const upVec = new THREE.Vector3(0, 1, 0);
    let smoothRoll = 0;

    let raf, time = 0;
    let lastScroll = 0;
    let scrollVel = 0;
    let boost = 0;
    let prevTangent = new THREE.Vector3(0, 0, -1);

    const unbind = bridge.subscribe((type) => {
      if (type === "hover") boost = 1.0;
    });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      time += 0.008;

      const sp = scrollRef.current;
      const raw = sp * (HUBS.length - 1);
      const fi = Math.min(Math.floor(raw), HUBS.length - 2);
      const frac = raw - fi;

      scrollVel = Math.abs(sp - lastScroll) * 60;
      lastScroll = sp;
      boost *= 0.92;

      const c0 = HUB_RGB[fi], c1 = HUB_RGB[fi + 1];
      const ar = c0[0] + (c1[0] - c0[0]) * frac;
      const ag = c0[1] + (c1[1] - c0[1]) * frac;
      const ab = c0[2] + (c1[2] - c0[2]) * frac;

      const root = document.documentElement;
      const hr = Math.round(ar * 255), hg = Math.round(ag * 255), hb = Math.round(ab * 255);
      root.style.setProperty('--accent', `rgb(${hr},${hg},${hb})`);
      root.style.setProperty('--accent-rgb', `${hr},${hg},${hb}`);

      const t = raw / (HUBS.length - 1);
      camTarget.copy(camCurve.getPoint(t));

      const camTangent = camCurve.getTangent(t).normalize();

      const lookAheadT = Math.min(t + 0.06, 1.0);
      const aheadCamPoint = camCurve.getPoint(lookAheadT);
      const aheadHubPoint = hubCurve.getPoint(lookAheadT);

      sMx += (tMx - sMx) * 0.03;
      sMy += (tMy - sMy) * 0.03;

      const spd = noMotion ? 1 : 0.02;
      camSmooth.lerp(camTarget, spd);

      camera.position.copy(camSmooth);
      camera.position.x += sMx * 28;
      camera.position.y += sMy * 18;

      const hubFocus = t > 0.8 ? 0.5 + (t - 0.8) * 2.5 : 0.5;
      const targetFocus = Math.min(hubFocus, 1.0);

      lookTarget.copy(aheadCamPoint).lerp(aheadHubPoint, targetFocus);

      lookSmooth.lerp(lookTarget, spd * 1.2);
      camera.lookAt(lookSmooth);

      const aheadTangent = camCurve.getTangent(lookAheadT).normalize();
      const cross = new THREE.Vector3().crossVectors(camTangent, aheadTangent);

      const velocityMult = Math.min(scrollVel + 0.2, 1.5);
      let targetRoll = -cross.y * 4.0 * velocityMult;

      targetRoll = Math.max(-0.45, Math.min(0.45, targetRoll));

      smoothRoll += (targetRoll - smoothRoll) * 0.03;
      camera.rotateZ(smoothRoll);

      const activeIdx = Math.min(Math.round(raw), HUBS.length - 1);

      if (!noMotion) {
        const speedMult = 1 + scrollVel * 4 + boost * 2;
        for (let i = 0; i < TOTAL; i++) {
          pos[i * 3] += vel[i * 3] * speedMult;
          pos[i * 3 + 1] += vel[i * 3 + 1] * speedMult;
          pos[i * 3 + 2] += vel[i * 3 + 2] * speedMult;
          if (Math.abs(pos[i * 3]) > 460) vel[i * 3] *= -0.82;
          if (Math.abs(pos[i * 3 + 1]) > 300) vel[i * 3 + 1] *= -0.82;
          if (pos[i * 3 + 2] > 120) vel[i * 3 + 2] -= 0.014;
          if (pos[i * 3 + 2] < -1280) vel[i * 3 + 2] += 0.014;
        }

        let lc = 0;
        for (let i = 0; i < TOTAL; i++) {
          let pr = 0.015 + ar * 0.15;
          let pg = 0.04 + ag * 0.15;
          let pb = 0.08 + ab * 0.15;

          for (let h = 0; h < HUBS.length; h++) {
            const hx = pos[i * 3] - HUBS[h].x;
            const hy = pos[i * 3 + 1] - HUBS[h].y;
            const hz = pos[i * 3 + 2] - HUBS[h].z;
            const glow = Math.max(0, 1 - (hx * hx + hy * hy + hz * hz) / (220 * 220));
            if (glow > 0) {
              const b = h === activeIdx ? 1.0 : 0.3;
              pr += glow * b * HUB_RGB[h][0];
              pg += glow * b * HUB_RGB[h][1];
              pb += glow * b * HUB_RGB[h][2];
            }
          }
          col[i * 3] = pr;
          col[i * 3 + 1] = pg;
          col[i * 3 + 2] = pb;

          if (lc >= MAX_LINKS) continue;
          for (let j = i + 1; j < TOTAL; j++) {
            if (lc >= MAX_LINKS) break;
            const ex = pos[i * 3] - pos[j * 3];
            const ey = pos[i * 3 + 1] - pos[j * 3 + 1];
            const ez = pos[i * 3 + 2] - pos[j * 3 + 2];
            const d2 = ex * ex + ey * ey + ez * ez;
            if (d2 < LINK_SQ) {
              const s = (1 - d2 / LINK_SQ) * 0.85;
              const k = lc * 6;
              lpArr[k] = pos[i * 3];
              lpArr[k + 1] = pos[i * 3 + 1];
              lpArr[k + 2] = pos[i * 3 + 2];
              lpArr[k + 3] = pos[j * 3];
              lpArr[k + 4] = pos[j * 3 + 1];
              lpArr[k + 5] = pos[j * 3 + 2];
              lcArr[k] = s * ar * 0.75;
              lcArr[k + 1] = s * ag * 0.75;
              lcArr[k + 2] = s * ab * 0.75;
              lcArr[k + 3] = s * ar * 0.75;
              lcArr[k + 4] = s * ag * 0.75;
              lcArr[k + 5] = s * ab * 0.75;
              lc++;
            }
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        lpA.needsUpdate = true;
        lcA.needsUpdate = true;
        lGeom.setDrawRange(0, lc * 2);

        hubMeshes.forEach(({ group, wires, light }, i) => {
          const dist = camera.position.distanceTo(HUBS[i]);
          const proximity = Math.max(0, 1 - dist / 400);

          group.rotation.y += 0.0025;
          group.rotation.x += 0.0015;

          const pulse = 1 + Math.sin(time * 1.4 + i) * 0.04;
          group.scale.setScalar(pulse);

          const isActive = i === activeIdx;
          wires.forEach(w => {
            w.wire.material.opacity = 0.15 + proximity * 0.35 + (isActive ? 0.12 : 0);
            w.wire2.material.opacity = 0.04 + proximity * 0.1;
          });

          light.intensity = isActive
            ? 3.5 + Math.sin(time * 2.2 + i) * 0.8
            : proximity * 1.2;
        });
      }

      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      unbind();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      sprite.dispose();
      ptGeom.dispose();
      ptMat.dispose();
      lGeom.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      hubMeshes.forEach(({ outerGroup }) => {
        outerGroup.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) o.material.dispose();
        });
      });
    };
  }, [noMotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}

