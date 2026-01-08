import { ref, computed, watch, onUnmounted, type Ref, type ComputedRef } from 'vue'

interface SkillState {
	baseX: number
	baseY: number
	x: number
	y: number
	vx: number
	vy: number
	angle: number
}

interface Skill {
	name: string
	icon: string[]
	color: string
}

// cfg
const RADIUS = 150
const ICON_SIZE = 56
const EXPANDED_WIDTH = 150
const MIN_GAP = 8
const SPRING = 0.003
const PUSH = 0.06
const FRICTION = 0.92
const FLOAT_AMP = 5
const FLOAT_SPEED = 0.001
const FIXED_DT = 1 / 60 // 60fps fixed step
const MAX_STEPS = 4 // max physics steps per frame

export function useSkillOrbit(skills: ComputedRef<Skill[]> | Ref<Skill[]>) {
	const hoveredIndex = ref<number | null>(null)
	const states = ref<SkillState[]>([])
	const time = ref(0)
	let frameId: number | null = null
	let accumulator = 0
	let lastTs = 0

	const initStates = (count: number) => {
		const arr: SkillState[] = []
		for (let i = 0; i < count; i++) {
			const angle = (i / count) * 2 * Math.PI - Math.PI / 2
			const x = Math.cos(angle) * RADIUS
			const y = Math.sin(angle) * RADIUS
			arr.push({
				baseX: x,
				baseY: y,
				x,
				y,
				vx: 0,
				vy: 0,
				angle,
			})
		}
		states.value = arr
	}

	const getBox = (idx: number) => {
		const s = states.value[idx]
		if (!s) return { left: 0, right: 0, top: 0, bottom: 0 }

		const isExpanded = hoveredIndex.value === idx
		const w = isExpanded ? EXPANDED_WIDTH : ICON_SIZE
		const h = ICON_SIZE

		return {
			left: s.x - w / 2,
			right: s.x + w / 2,
			top: s.y - h / 2,
			bottom: s.y + h / 2,
		}
	}

	const getOverlap = (idxA: number, idxB: number) => {
		const boxA = getBox(idxA)
		const boxB = getBox(idxB)
		const sA = states.value[idxA]
		const sB = states.value[idxB]
		if (!sA || !sB) return null

		const overlapX = Math.min(boxA.right, boxB.right) - Math.max(boxA.left, boxB.left) + MIN_GAP
		const overlapY = Math.min(boxA.bottom, boxB.bottom) - Math.max(boxA.top, boxB.top) + MIN_GAP

		if (overlapX <= 0 || overlapY <= 0) return null

		const dx = sB.x - sA.x
		const dy = sB.y - sA.y
		const dist = Math.sqrt(dx * dx + dy * dy) || 1

		return {
			nx: dx / dist,
			ny: dy / dist,
			overlap: Math.max(overlapX, overlapY),
		}
	}

	const physicsStep = () => {
		const arr = states.value
		const total = arr.length
		if (total === 0) return

		time.value += FIXED_DT * 1000
		const hasHover = hoveredIndex.value !== null

		const pushed = new Array(total).fill(false)

		if (hasHover) {
			for (let pass = 0; pass < 3; pass++) {
				for (let i = 0; i < total; i++) {
					if (hoveredIndex.value === i) continue

					for (let j = 0; j < total; j++) {
						if (i === j) continue

						const overlap = getOverlap(j, i)
						if (!overlap) continue

						const isHoveredJ = hoveredIndex.value === j
						if (!isHoveredJ && !pushed[j]) continue

						// push i away
						const force = overlap.overlap * PUSH
						arr[i].vx += overlap.nx * force
						arr[i].vy += overlap.ny * force
						pushed[i] = true
					}
				}
			}
		}

		// spring + integrate for each
		for (let i = 0; i < total; i++) {
			const s = arr[i]

			if (hoveredIndex.value === i) {
				s.x = s.baseX
				s.y = s.baseY
				s.vx = 0
				s.vy = 0
				continue
			}

			// float when idle
			let floatY = 0
			if (!hasHover) {
				const phase = i * 0.6
				const spd = 1 + (i % 3) * 0.1
				floatY = Math.sin(time.value * FLOAT_SPEED * spd + phase) * FLOAT_AMP
			}

			// spring to base
			if (!pushed[i]) {
				const tx = s.baseX
				const ty = s.baseY + floatY
				s.vx += (tx - s.x) * SPRING
				s.vy += (ty - s.y) * SPRING
			}

			// friction
			s.vx *= FRICTION
			s.vy *= FRICTION

			// integrate
			s.x += s.vx
			s.y += s.vy
		}
	}

	const loop = (ts: number) => {
		if (lastTs === 0) lastTs = ts
		const frameTime = Math.min((ts - lastTs) / 1000, 0.1) // cap at 100ms
		lastTs = ts

		accumulator += frameTime
		let steps = 0

		while (accumulator >= FIXED_DT && steps < MAX_STEPS) {
			physicsStep()
			accumulator -= FIXED_DT
			steps++
		}

		if (accumulator > FIXED_DT * 2) {
			accumulator = 0
		}

		frameId = requestAnimationFrame(loop)
	}

	const start = () => {
		if (skills.value.length > 0 && states.value.length !== skills.value.length) {
			initStates(skills.value.length)
		}
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

	watch(
		() => skills.value.length,
		(count) => {
			if (count > 0) {
				initStates(count)
				start()
			}
		},
		{ immediate: true }
	)

	if (typeof window !== 'undefined') {
		start()
	}

	onUnmounted(() => {
		stop()
	})

	const getIconStyle = (index: number) => {
		const s = states.value[index]
		if (!s) return {}
		return {
			transform: `translate(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px))`,
		}
	}

	const getExpandDirection = (index: number): 'row' | 'row-reverse' => {
		const s = states.value[index]
		if (!s) return 'row'
		return Math.cos(s.angle) >= 0 ? 'row' : 'row-reverse'
	}

	const setHovered = (index: number | null) => {
		hoveredIndex.value = index
	}

	return {
		hoveredIndex: computed(() => hoveredIndex.value),
		getIconStyle,
		getExpandDirection,
		setHovered,
	}
}
