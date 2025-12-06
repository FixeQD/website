<template>
	<canvas ref="canvasRef" class="fixed inset-0 -z-10 h-full w-full"></canvas>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let scene, camera, renderer, particles, animationId
let mouseX = 0,
	mouseY = 0

onMounted(() => {
	if (!canvasRef.value) return

	// Initialize Three.js
	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
	camera.position.z = 500

	renderer = new THREE.WebGLRenderer({
		canvas: canvasRef.value,
		alpha: true,
		antialias: true,
	})
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.setClearColor(0x000000, 0)

	// Create particles
	const particleCount = 1500
	const geometry = new THREE.BufferGeometry()
	const positions = new Float32Array(particleCount * 3)
	const colors = new Float32Array(particleCount * 3)
	const sizes = new Float32Array(particleCount)

	const colorPalette = [
		new THREE.Color(0x00d9ff),
		new THREE.Color(0xff0080),
		new THREE.Color(0x00ff88),
	]

	for (let i = 0; i < particleCount; i++) {
		const i3 = i * 3
		positions[i3] = (Math.random() - 0.5) * 2000
		positions[i3 + 1] = (Math.random() - 0.5) * 2000
		positions[i3 + 2] = (Math.random() - 0.5) * 1000

		const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
		colors[i3] = color.r
		colors[i3 + 1] = color.g
		colors[i3 + 2] = color.b

		sizes[i] = Math.random() * 3 + 1
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

	const material = new THREE.PointsMaterial({
		size: 2,
		vertexColors: true,
		transparent: true,
		opacity: 0.8,
		sizeAttenuation: true,
		blending: THREE.AdditiveBlending,
	})

	particles = new THREE.Points(geometry, material)
	scene.add(particles)

	// Mouse move handler
	const onMouseMove = (event) => {
		mouseX = (event.clientX - window.innerWidth / 2) * 0.1
		mouseY = (event.clientY - window.innerHeight / 2) * 0.1
	}

	// Resize handler
	const onResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	window.addEventListener('mousemove', onMouseMove)
	window.addEventListener('resize', onResize)

	// Animation loop
	const animate = () => {
		animationId = requestAnimationFrame(animate)

		particles.rotation.y += 0.0005
		particles.rotation.x += 0.0003

		camera.position.x += (mouseX - camera.position.x) * 0.05
		camera.position.y += (-mouseY - camera.position.y) * 0.05
		camera.lookAt(scene.position)

		renderer.render(scene, camera)
	}

	animate()

	// Cleanup
	onUnmounted(() => {
		window.removeEventListener('mousemove', onMouseMove)
		window.removeEventListener('resize', onResize)
	})
})

onUnmounted(() => {
	if (animationId) {
		cancelAnimationFrame(animationId)
	}
	if (renderer) {
		renderer.dispose()
	}
})
</script>
