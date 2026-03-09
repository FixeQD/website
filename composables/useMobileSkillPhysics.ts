import { ref, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue'

interface Skill {
	name: string
	icon: string[]
	color: string
}

interface SkillBody {
	x: number
	y: number
	vx: number
	vy: number
	baseX: number
	baseY: number
	angle: number
	radius: number
	isDragging: boolean
	dragIntensity: number
}

// --- constants

const ORBIT_RADIUS = 110
const ICON_RADIUS = 26
const SPRING = 0.08
const FRICTION = 0.92
const THROW_MULTIPLIER = 12
const GLOW_DECAY = 0.95
const MIN_VELOCITY = 0.1
const COLLISION_PUSH = 0.5
const FIXED_DT = 1 / 60
const MAX_STEPS = 4

export function useMobileSkillPhysics(
	skills: ComputedRef<Skill[]> | Ref<Skill[]>,
	containerRef: Ref<HTMLElement | null>
) {
	// --- state

	const bodies = ref<SkillBody[]>([])
	const centerGlowIntensity = ref(0)
	let frameId: number | null = null
	let containerCenter = { x: 0, y: 0 }
	let accumulator = 0
	let lastTs = 0

	let dragIndex: number | null = null
	let lastPointerPos = { x: 0, y: 0 }
	let lastPointerTime = 0

	// --- init

	const initBodies = () => {
		if (!containerRef.value) return

		const rect = containerRef.value.getBoundingClientRect()
		containerCenter = { x: rect.width / 2, y: rect.height / 2 }

		const count = skills.value.length
		const arr: SkillBody[] = []

		for (let i = 0; i < count; i++) {
			const angle = (i / count) * 2 * Math.PI - Math.PI / 2
			const baseX = containerCenter.x + Math.cos(angle) * ORBIT_RADIUS
			const baseY = containerCenter.y + Math.sin(angle) * ORBIT_RADIUS

			arr.push({
				x: baseX,
				y: baseY,
				vx: 0,
				vy: 0,
				baseX,
				baseY,
				angle,
				radius: ICON_RADIUS,
				isDragging: false,
				dragIntensity: 0,
			})
		}

		bodies.value = arr
	}

	// --- physics

	const resolveCollisions = () => {
		const arr = bodies.value
		const len = arr.length

		for (let i = 0; i < len; i++) {
			for (let j = i + 1; j < len; j++) {
				const a = arr[i]
				const b = arr[j]

				const dx = b.x - a.x
				const dy = b.y - a.y
				const dist = Math.sqrt(dx * dx + dy * dy)
				const minDist = a.radius + b.radius + 4

				if (dist < minDist && dist > 0) {
					const nx = dx / dist
					const ny = dy / dist
					const pushX = (nx * (minDist - dist)) / 2
					const pushY = (ny * (minDist - dist)) / 2

					if (!a.isDragging) {
						a.x -= pushX
						a.y -= pushY
					}
					if (!b.isDragging) {
						b.x += pushX
						b.y += pushY
					}

					if (!a.isDragging && !b.isDragging) {
						const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
						if (dot > 0) {
							const impulse = dot * COLLISION_PUSH
							a.vx -= impulse * nx
							a.vy -= impulse * ny
							b.vx += impulse * nx
							b.vy += impulse * ny
						}
					}
				}
			}
		}
	}

	const physicsStep = () => {
		const arr = bodies.value
		let maxIntensity = 0

		for (const body of arr) {
			if (body.isDragging) {
				const dx = body.x - body.baseX
				const dy = body.y - body.baseY
				body.dragIntensity = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 100)
				maxIntensity = Math.max(maxIntensity, body.dragIntensity)
				continue
			}

			body.vx += (body.baseX - body.x) * SPRING
			body.vy += (body.baseY - body.y) * SPRING
			body.vx *= FRICTION
			body.vy *= FRICTION

			if (Math.abs(body.vx) < MIN_VELOCITY) body.vx = 0
			if (Math.abs(body.vy) < MIN_VELOCITY) body.vy = 0

			body.x += body.vx
			body.y += body.vy

			body.dragIntensity *= GLOW_DECAY
			if (body.dragIntensity < 0.01) body.dragIntensity = 0

			maxIntensity = Math.max(maxIntensity, body.dragIntensity)
		}

		centerGlowIntensity.value = maxIntensity
		resolveCollisions()
	}

	// --- loop

	const loop = (ts: number) => {
		if (lastTs === 0) lastTs = ts
		const frameTime = Math.min((ts - lastTs) / 1000, 0.1)
		lastTs = ts

		accumulator += frameTime
		let steps = 0
		while (accumulator >= FIXED_DT && steps < MAX_STEPS) {
			physicsStep()
			accumulator -= FIXED_DT
			steps++
		}
		if (accumulator > FIXED_DT * 2) accumulator = 0

		frameId = requestAnimationFrame(loop)
	}

	const start = () => {
		if (frameId === null) {
			lastTs = 0
			accumulator = 0
			frameId = requestAnimationFrame(loop)
		}
	}

	const stop = () => {
		if (frameId !== null) {
			cancelAnimationFrame(frameId)
			frameId = null
		}
	}

	// --- input

	const getPointerPos = (e: TouchEvent | MouseEvent) => {
		if (!containerRef.value) return { x: 0, y: 0 }
		const rect = containerRef.value.getBoundingClientRect()

		let clientX: number, clientY: number
		if ('touches' in e && e.touches.length > 0) {
			clientX = e.touches[0].clientX
			clientY = e.touches[0].clientY
		} else if ('changedTouches' in e && e.changedTouches.length > 0) {
			clientX = e.changedTouches[0].clientX
			clientY = e.changedTouches[0].clientY
		} else if ('clientX' in e) {
			clientX = e.clientX
			clientY = e.clientY
		} else {
			return { x: 0, y: 0 }
		}

		return { x: clientX - rect.left, y: clientY - rect.top }
	}

	const findBodyAtPos = (x: number, y: number): number | null => {
		for (let i = bodies.value.length - 1; i >= 0; i--) {
			const b = bodies.value[i]
			const dx = x - b.x
			const dy = y - b.y
			if (dx * dx + dy * dy < (b.radius + 12) ** 2) return i
		}
		return null
	}

	const onPointerDown = (e: TouchEvent | MouseEvent) => {
		const pos = getPointerPos(e)
		const idx = findBodyAtPos(pos.x, pos.y)
		if (idx !== null) {
			dragIndex = idx
			bodies.value[idx].isDragging = true
			bodies.value[idx].vx = 0
			bodies.value[idx].vy = 0
			lastPointerPos = pos
			lastPointerTime = performance.now()
		}
	}

	const onPointerMove = (e: TouchEvent | MouseEvent) => {
		if (dragIndex === null) return
		const pos = getPointerPos(e)
		const body = bodies.value[dragIndex]
		if (body) {
			body.x = pos.x
			body.y = pos.y
			const dt = performance.now() - lastPointerTime
			if (dt > 0) {
				body.vx = ((pos.x - lastPointerPos.x) / dt) * THROW_MULTIPLIER
				body.vy = ((pos.y - lastPointerPos.y) / dt) * THROW_MULTIPLIER
			}
			lastPointerPos = pos
			lastPointerTime = performance.now()
		}
	}

	const onPointerUp = () => {
		if (dragIndex !== null && bodies.value[dragIndex]) {
			bodies.value[dragIndex].isDragging = false
		}
		dragIndex = null
	}

	const bindEvents = () => {
		if (!containerRef.value) return
		const el = containerRef.value
		el.addEventListener('touchstart', onPointerDown, { passive: true })
		window.addEventListener('touchmove', onPointerMove, { passive: true })
		window.addEventListener('touchend', onPointerUp)
		window.addEventListener('touchcancel', onPointerUp)
		el.addEventListener('mousedown', onPointerDown)
		window.addEventListener('mousemove', onPointerMove)
		window.addEventListener('mouseup', onPointerUp)
	}

	const unbindEvents = () => {
		if (!containerRef.value) return
		const el = containerRef.value
		el.removeEventListener('touchstart', onPointerDown)
		window.removeEventListener('touchmove', onPointerMove)
		window.removeEventListener('touchend', onPointerUp)
		window.removeEventListener('touchcancel', onPointerUp)
		el.removeEventListener('mousedown', onPointerDown)
		window.removeEventListener('mousemove', onPointerMove)
		window.removeEventListener('mouseup', onPointerUp)
	}

	// --- public api

	const getBodyStyle = (index: number) => {
		const body = bodies.value[index]
		if (!body) return {}
		return {
			transform: `translate(${body.x - body.radius}px, ${body.y - body.radius}px)`,
			width: `${body.radius * 2}px`,
			height: `${body.radius * 2}px`,
		}
	}

	const getBodyGlowIntensity = (index: number): number => {
		return bodies.value[index]?.dragIntensity ?? 0
	}

	onMounted(() => {
		setTimeout(() => {
			initBodies()
			bindEvents()
			start()
		}, 100)
	})

	onUnmounted(() => {
		stop()
		unbindEvents()
	})

	return {
		bodies,
		centerGlowIntensity,
		getBodyStyle,
		getBodyGlowIntensity,
		initBodies,
	}
}
