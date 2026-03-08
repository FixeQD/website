<template>
	<canvas ref="canvasRef" class="fixed inset-0 -z-10 h-full w-full"></canvas>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let renderer, animationId
let mouseX = 0,
	mouseY = 0
let scrollY = 0,
	targetScrollY = 0
let lookTargetX = 0,
	lookTargetY = 0
let isPointerDown = false

onMounted(() => {
	if (!canvasRef.value) return

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000)
	camera.position.z = 500

	renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.setClearColor(0x000000, 0)

	const NODE_COUNT = 150
	const CONNECT_DIST = 200
	const MAX_LINES = 310
	const MAX_SCREEN_DIST_SQ = 2.0 * 2.0
	const BOUNDS_X = 900
	const BOUNDS_Y = 550
	const BOUNDS_Z = 600

	// Mouse interaction
	const REPEL_RADIUS = 320
	const REPEL_R2 = REPEL_RADIUS * REPEL_RADIUS
	const ATTRACT_RADIUS = 280
	const ATTRACT_R2 = ATTRACT_RADIUS * ATTRACT_RADIUS
	const HIGHLIGHT_R = 250

	// Physics tuning
	const FRICTION = 0.9
	const MAX_EXTRA_SPEED = 6.0

	// Node-to-node soft repulsion
	const NODE_REPEL_RADIUS = 80
	const NODE_REPEL_R2 = NODE_REPEL_RADIUS * NODE_REPEL_RADIUS
	const NODE_REPEL_FORCE = 0.055

	// Soft boundary (start pushing this far from edge)
	const SOFT_MARGIN = 180
	const SOFT_FORCE = 0.007

	// Buffers
	const positions = new Float32Array(NODE_COUNT * 3)
	const driftAngles = new Float32Array(NODE_COUNT)
	const driftSpeeds = new Float32Array(NODE_COUNT)
	const nodeSpeeds = new Float32Array(NODE_COUNT)
	const baseVelocities = new Float32Array(NODE_COUNT * 2)
	const extraVelocities = new Float32Array(NODE_COUNT * 2)
	// Accumulator for node-to-node forces, zeroed each frame
	const nodeForces = new Float32Array(NODE_COUNT * 2)

	for (let i = 0; i < NODE_COUNT; i++) {
		positions[i * 3] = (Math.random() - 0.5) * BOUNDS_X * 2
		positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS_Y * 2
		positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS_Z * 2

		// Each node drifts at its own angle that slowly rotates
		driftAngles[i] = Math.random() * Math.PI * 2
		// Random sign + small magnitude so paths curve gently
		driftSpeeds[i] = (Math.random() < 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.007)
		nodeSpeeds[i] = 0.1 + Math.random() * 0.15

		baseVelocities[i * 2] = Math.cos(driftAngles[i]) * nodeSpeeds[i]
		baseVelocities[i * 2 + 1] = Math.sin(driftAngles[i]) * nodeSpeeds[i]
	}

	const _projVec = new THREE.Vector3()
	const screenPos = new Float32Array(NODE_COUNT * 2)

	// Node points
	const nodeGeo = new THREE.BufferGeometry()
	const nodePosAttr = new THREE.BufferAttribute(positions, 3)
	nodePosAttr.setUsage(THREE.DynamicDrawUsage)
	nodeGeo.setAttribute('position', nodePosAttr)
	scene.add(
		new THREE.Points(
			nodeGeo,
			new THREE.PointsMaterial({
				size: 2,
				color: 0xffffff,
				transparent: true,
				opacity: 0.5,
				sizeAttenuation: true,
			})
		)
	)

	// Lines with vertex colors for dynamic brightening
	const linePos = new Float32Array(MAX_LINES * 6)
	const lineColors = new Float32Array(MAX_LINES * 6)
	const lineGeo = new THREE.BufferGeometry()
	const linePosAttr = new THREE.BufferAttribute(linePos, 3)
	const lineColAttr = new THREE.BufferAttribute(lineColors, 3)
	linePosAttr.setUsage(THREE.DynamicDrawUsage)
	lineColAttr.setUsage(THREE.DynamicDrawUsage)
	lineGeo.setAttribute('position', linePosAttr)
	lineGeo.setAttribute('color', lineColAttr)
	lineGeo.setDrawRange(0, 0)
	scene.add(
		new THREE.LineSegments(
			lineGeo,
			new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4 })
		)
	)

	let mouseWorldX = 0,
		mouseWorldY = 0
	let mouseVelX = 0,
		mouseVelY = 0

	const getMouseWorld = () => {
		const ndc = new THREE.Vector3(mouseX, -mouseY, 0.5)
		ndc.unproject(camera)
		const dir = ndc.sub(camera.position).normalize()
		const t = -camera.position.z / dir.z
		return {
			x: camera.position.x + t * dir.x,
			y: camera.position.y + t * dir.y,
		}
	}

	const onMouseMove = (e) => {
		mouseX = (e.clientX / window.innerWidth - 0.5) * 2
		mouseY = (e.clientY / window.innerHeight - 0.5) * 2
	}

	const onTouchMove = (e) => {
		if (!e.touches.length) return
		mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2
		mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
	}

	const onPointerDown = (e) => {
		isPointerDown = true
		mouseX = (e.clientX / window.innerWidth - 0.5) * 2
		mouseY = (e.clientY / window.innerHeight - 0.5) * 2
	}

	const onTouchStart = (e) => {
		isPointerDown = true
		if (e.touches.length) {
			mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2
			mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
		}
	}

	const onPointerUp = () => {
		isPointerDown = false
	}

	const onScroll = () => {
		targetScrollY = window.scrollY
	}

	const onResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	window.addEventListener('mousemove', onMouseMove)
	window.addEventListener('mousedown', onPointerDown)
	window.addEventListener('mouseup', onPointerUp)
	window.addEventListener('touchmove', onTouchMove, { passive: true })
	window.addEventListener('touchstart', onTouchStart, { passive: true })
	window.addEventListener('touchend', onPointerUp, { passive: true })
	window.addEventListener('resize', onResize)
	window.addEventListener('scroll', onScroll, { passive: true })

	const animate = () => {
		animationId = requestAnimationFrame(animate)

		// Scroll-driven camera fly-through
		scrollY += (targetScrollY - scrollY) * 0.06
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight
		const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0
		camera.position.z = 500 - scrollProgress * BOUNDS_Z * 1.6

		// Wrap nodes that drifted past the camera along Z
		for (let i = 0; i < NODE_COUNT; i++) {
			if (positions[i * 3 + 2] > camera.position.z + 50) {
				positions[i * 3 + 2] -= BOUNDS_Z * 2
			} else if (positions[i * 3 + 2] < camera.position.z - BOUNDS_Z * 2) {
				positions[i * 3 + 2] += BOUNDS_Z * 2
			}
		}

		// Update drift angles -> curved organic base paths
		for (let i = 0; i < NODE_COUNT; i++) {
			driftAngles[i] += driftSpeeds[i]
			baseVelocities[i * 2] = Math.cos(driftAngles[i]) * nodeSpeeds[i]
			baseVelocities[i * 2 + 1] = Math.sin(driftAngles[i]) * nodeSpeeds[i]
		}

		// Update mouse world position and velocity
		const mw = getMouseWorld()
		mouseVelX = mw.x - mouseWorldX
		mouseVelY = mw.y - mouseWorldY
		mouseWorldX = mw.x
		mouseWorldY = mw.y
		const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY)

		// Node-to-node soft repulsion - prevents clumping, creates natural spacing
		nodeForces.fill(0)
		for (let i = 0; i < NODE_COUNT; i++) {
			for (let j = i + 1; j < NODE_COUNT; j++) {
				const dx = positions[i * 3] - positions[j * 3]
				const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
				const dist2 = dx * dx + dy * dy
				if (dist2 >= NODE_REPEL_R2 || dist2 < 1) continue

				const dist = Math.sqrt(dist2)
				const force = NODE_REPEL_FORCE * (1 - dist / NODE_REPEL_RADIUS)
				const fx = (dx / dist) * force
				const fy = (dy / dist) * force
				nodeForces[i * 2] += fx
				nodeForces[i * 2 + 1] += fy
				nodeForces[j * 2] -= fx
				nodeForces[j * 2 + 1] -= fy
			}
		}

		// Per-node physics
		for (let i = 0; i < NODE_COUNT; i++) {
			const px = positions[i * 3]
			const py = positions[i * 3 + 1]
			const pz = positions[i * 3 + 2]

			// Z-distance factor: nodes far from camera plane react less to mouse
			const dzCamera = pz - camera.position.z
			const zFactor = Math.max(0.35, 1 - Math.abs(dzCamera) / 500)

			const dx = px - mouseWorldX
			const dy = py - mouseWorldY
			const dist2 = dx * dx + dy * dy

			if (isPointerDown && dist2 < ATTRACT_R2 && dist2 > 1) {
				// Click/touch: attract nodes toward cursor
				const dist = Math.sqrt(dist2)
				const falloff = 1 - dist / ATTRACT_RADIUS
				extraVelocities[i * 2] -= (dx / dist) * falloff * 0.35 * zFactor
				extraVelocities[i * 2 + 1] -= (dy / dist) * falloff * 0.35 * zFactor
			} else if (!isPointerDown && dist2 < REPEL_R2 && dist2 > 1) {
				// Hover: repel nodes from cursor
				const dist = Math.sqrt(dist2)
				const falloff = 1 - dist / REPEL_RADIUS

				extraVelocities[i * 2] += (dx / dist) * falloff * 0.45 * zFactor
				extraVelocities[i * 2 + 1] += (dy / dist) * falloff * 0.45 * zFactor

				// Wake force: fast mouse drags nearby nodes along
				if (mouseSpeed > 2) {
					const wake = falloff * Math.min(mouseSpeed * 0.07, 1.4) * zFactor
					extraVelocities[i * 2] += (mouseVelX / mouseSpeed) * wake
					extraVelocities[i * 2 + 1] += (mouseVelY / mouseSpeed) * wake
				}
			}

			// Apply accumulated node-to-node repulsion
			extraVelocities[i * 2] += nodeForces[i * 2]
			extraVelocities[i * 2 + 1] += nodeForces[i * 2 + 1]

			// Soft boundary: push back from edges before hard wrap
			const bxSoft = BOUNDS_X - SOFT_MARGIN
			const bySoft = BOUNDS_Y - SOFT_MARGIN
			if (px > bxSoft) {
				extraVelocities[i * 2] -= ((px - bxSoft) / SOFT_MARGIN) * SOFT_FORCE
			} else if (px < -bxSoft) {
				extraVelocities[i * 2] += ((-px - bxSoft) / SOFT_MARGIN) * SOFT_FORCE
			}
			if (py > bySoft) {
				extraVelocities[i * 2 + 1] -= ((py - bySoft) / SOFT_MARGIN) * SOFT_FORCE
			} else if (py < -bySoft) {
				extraVelocities[i * 2 + 1] += ((-py - bySoft) / SOFT_MARGIN) * SOFT_FORCE
			}

			// Decay extra velocity
			extraVelocities[i * 2] *= FRICTION
			extraVelocities[i * 2 + 1] *= FRICTION

			// Cap extra speed
			const ev = Math.sqrt(
				extraVelocities[i * 2] * extraVelocities[i * 2] +
					extraVelocities[i * 2 + 1] * extraVelocities[i * 2 + 1]
			)
			if (ev > MAX_EXTRA_SPEED) {
				extraVelocities[i * 2] = (extraVelocities[i * 2] / ev) * MAX_EXTRA_SPEED
				extraVelocities[i * 2 + 1] = (extraVelocities[i * 2 + 1] / ev) * MAX_EXTRA_SPEED
			}

			// Integrate position
			positions[i * 3] += baseVelocities[i * 2] + extraVelocities[i * 2]
			positions[i * 3 + 1] += baseVelocities[i * 2 + 1] + extraVelocities[i * 2 + 1]

			// Hard wrap at bounds (fallback when soft force isn't enough)
			if (positions[i * 3] > BOUNDS_X) positions[i * 3] = -BOUNDS_X
			if (positions[i * 3] < -BOUNDS_X) positions[i * 3] = BOUNDS_X
			if (positions[i * 3 + 1] > BOUNDS_Y) positions[i * 3 + 1] = -BOUNDS_Y
			if (positions[i * 3 + 1] < -BOUNDS_Y) positions[i * 3 + 1] = BOUNDS_Y
		}
		nodePosAttr.needsUpdate = true

		// Project all nodes to NDC for screen-space distance check
		camera.updateMatrixWorld()
		for (let i = 0; i < NODE_COUNT; i++) {
			_projVec.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
			_projVec.project(camera)
			// z > 1 means behind the camera
			screenPos[i * 2] = _projVec.z > 1 ? Infinity : _projVec.x
			screenPos[i * 2 + 1] = _projVec.z > 1 ? Infinity : _projVec.y
		}

		// Rebuild line segments
		let lineCount = 0
		const threshold2 = CONNECT_DIST * CONNECT_DIST

		for (let i = 0; i < NODE_COUNT && lineCount < MAX_LINES; i++) {
			for (let j = i + 1; j < NODE_COUNT && lineCount < MAX_LINES; j++) {
				const sdx = screenPos[i * 2] - screenPos[j * 2]
				const sdy = screenPos[i * 2 + 1] - screenPos[j * 2 + 1]
				if (sdx * sdx + sdy * sdy > MAX_SCREEN_DIST_SQ) continue

				const dx = positions[i * 3] - positions[j * 3]
				const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
				const dz = positions[i * 3 + 2] - positions[j * 3 + 2]

				if (dx * dx + dy * dy + dz * dz < threshold2) {
					const base = lineCount * 6
					linePos[base] = positions[i * 3]
					linePos[base + 1] = positions[i * 3 + 1]
					linePos[base + 2] = positions[i * 3 + 2]
					linePos[base + 3] = positions[j * 3]
					linePos[base + 4] = positions[j * 3 + 1]
					linePos[base + 5] = positions[j * 3 + 2]

					// Brighten lines near cursor
					const midX = (positions[i * 3] + positions[j * 3]) / 2
					const midY = (positions[i * 3 + 1] + positions[j * 3 + 1]) / 2
					const mdx = midX - mouseWorldX
					const mdy = midY - mouseWorldY
					const mDist2 = mdx * mdx + mdy * mdy
					const brightness =
						mDist2 < HIGHLIGHT_R * HIGHLIGHT_R
							? 0.175 + (1 - Math.sqrt(mDist2) / HIGHLIGHT_R) * 0.825
							: 0.175

					for (let c = 0; c < 6; c++) lineColors[base + c] = brightness

					lineCount++
				}
			}
		}

		lineGeo.setDrawRange(0, lineCount * 2)
		linePosAttr.needsUpdate = true
		lineColAttr.needsUpdate = true

		// Parallax + rotation feel
		lookTargetX += (mouseX * 80 - lookTargetX) * 0.05
		lookTargetY += (-mouseY * 80 - lookTargetY) * 0.05
		camera.position.x += (mouseX * 30 - camera.position.x) * 0.04
		camera.position.y += (-mouseY * 30 - camera.position.y) * 0.04
		camera.lookAt(lookTargetX, lookTargetY, camera.position.z - 300)

		renderer.render(scene, camera)
	}

	animate()

	onUnmounted(() => {
		window.removeEventListener('mousemove', onMouseMove)
		window.removeEventListener('mousedown', onPointerDown)
		window.removeEventListener('mouseup', onPointerUp)
		window.removeEventListener('touchmove', onTouchMove)
		window.removeEventListener('touchstart', onTouchStart)
		window.removeEventListener('touchend', onPointerUp)
		window.removeEventListener('resize', onResize)
		window.removeEventListener('scroll', onScroll)
	})
})

onUnmounted(() => {
	if (animationId) cancelAnimationFrame(animationId)
	if (renderer) renderer.dispose()
})
</script>
