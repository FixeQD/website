<template>
	<section
		id="home"
		class="relative flex min-h-screen items-start overflow-hidden pt-32 lg:items-center lg:pt-0">
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

		<!-- Text content -->
		<div class="container pointer-events-none relative z-20 mx-auto px-6">
			<div class="pointer-events-auto max-w-xl">
				<!-- Typewriter -->
				<div class="mb-6 flex h-8 items-center">
					<span class="typewriter border-r-2 border-primary pr-1 text-lg text-primary">{{
						typewriterText
					}}</span>
				</div>

				<h1
					class="mb-8 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
					I build things<br />
					<span
						class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						for the web.
					</span>
				</h1>

				<div class="flex items-center gap-6">
					<a
						href="#projects"
						class="group inline-flex items-center gap-3 rounded-full border border-primary bg-primary/10 px-6 py-3 font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-dark">
						<span>See my work</span>
						<font-awesome-icon
							icon="arrow-right"
							class="transition-transform group-hover:translate-x-1" />
					</a>

					<div class="flex gap-3">
						<component
							v-for="social in data?.socials"
							:key="social.name"
							:is="social.name === 'Discord' ? 'button' : 'a'"
							:href="social.name !== 'Discord' ? social.url : undefined"
							:target="social.name !== 'Discord' ? '_blank' : undefined"
							:rel="social.name !== 'Discord' ? 'noopener' : undefined"
							@click="social.name === 'Discord' ? openDiscordModal(social) : null"
							class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-primary hover:text-primary">
							<font-awesome-icon :icon="['fab', social.icon]" class="h-4 w-4" />
						</component>
					</div>
				</div>
			</div>
		</div>

		<!-- Orbit overlay (desktop) - anchored in the right half of the section -->
		<div
			ref="orbitContainer"
			class="orbit-anchor pointer-events-none absolute left-[65%] top-1/2 hidden lg:block">
			<!-- Center glow -->
			<div
				class="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"></div>

			<!-- Skill icons -->
			<div
				v-for="(skill, index) in floatingSkills"
				:key="skill.name"
				class="skill-icon group pointer-events-auto absolute"
				:style="getIconStyle(Number(index))"
				@mouseenter="setHovered(Number(index))"
				@mouseleave="setHovered(null)">
				<!-- Idle glow -->
				<div
					class="absolute inset-0 rounded-full blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-0"
					:style="{ background: skill.color, opacity: 0.35 }"></div>

				<!-- Card -->
				<div
					class="skill-card relative flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all duration-500 ease-out group-hover:rounded-xl group-hover:border group-hover:border-white/20 group-hover:bg-dark/95 group-hover:p-2.5 group-hover:backdrop-blur-md"
					:style="{ flexDirection: getExpandDirection(Number(index)) }">
					<!-- Hover glow -->
					<div
						class="absolute inset-0 scale-0 rounded-xl opacity-0 blur-lg transition-all duration-500 group-hover:scale-110 group-hover:opacity-50"
						:style="{ background: skill.color }"></div>

					<!-- Icon -->
					<div
						class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-500"
						:style="{ background: `${skill.color}20` }">
						<svg
							v-if="skill.svgPath"
							viewBox="0 0 24 24"
							class="h-5 w-5 transition-all duration-300 group-hover:scale-110"
							:style="{ fill: skill.color }">
							<path :d="skill.svgPath" />
						</svg>
						<font-awesome-icon
							v-else
							:icon="skill.icon"
							class="text-lg transition-all duration-300 group-hover:scale-110"
							:style="{ color: skill.color }" />
					</div>

					<!-- Name -->
					<span
						class="relative max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:max-w-[120px] group-hover:opacity-100"
						:style="{
							[getExpandDirection(Number(index)) === 'row'
								? 'paddingRight'
								: 'paddingLeft']: '0.5rem',
						}">
						{{ skill.name }}
					</span>
				</div>
			</div>
		</div>

		<!-- Mobile orbit playground -->
		<div
			ref="mobilePlaygroundRef"
			class="absolute bottom-16 left-1/2 h-[260px] w-[260px] -translate-x-1/2 touch-none select-none lg:hidden">
			<div
				class="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"></div>

			<!-- Center glow -->
			<div
				class="absolute left-1/2 top-1/2 h-16 w-16 rounded-full blur-xl transition-all duration-150"
				:style="{
					background:
						draggedSkillIndex !== null
							? floatingSkills[draggedSkillIndex]?.color
							: 'rgb(0 217 255 / 0.15)',
					transform: `translate(-50%, -50%) scale(${1 + centerGlowIntensity * 2.5})`,
					opacity: 0.3 + centerGlowIntensity * 0.7,
				}"></div>

			<!-- Spring line -->
			<Teleport to="body">
				<svg
					v-if="draggedSkillIndex !== null"
					class="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen"
					style="left: 0; top: 0">
					<line
						:x1="springLineCenter.x"
						:y1="springLineCenter.y"
						:x2="springLineEnd.x"
						:y2="springLineEnd.y"
						:stroke="floatingSkills[draggedSkillIndex]?.color ?? '#00d9ff'"
						stroke-width="2"
						stroke-dasharray="5 5"
						:opacity="0.4 + getBodyGlowIntensity(draggedSkillIndex) * 0.5" />
				</svg>
			</Teleport>

			<!-- Skill bodies -->
			<div
				v-for="(skill, index) in floatingSkills"
				:key="skill.name"
				class="absolute cursor-grab rounded-full border border-white/20 bg-dark/95 backdrop-blur-sm active:cursor-grabbing"
				:style="{
					...getBodyStyle(Number(index)),
					boxShadow:
						getBodyGlowIntensity(Number(index)) > 0
							? `0 0 ${25 * getBodyGlowIntensity(Number(index))}px ${skill.color}`
							: 'none',
				}">
				<div
					class="flex h-full w-full items-center justify-center rounded-full"
					:style="{ background: `${skill.color}20` }">
					<svg
						v-if="skill.svgPath"
						viewBox="0 0 24 24"
						class="h-4 w-4"
						:style="{ fill: skill.color }">
						<path :d="skill.svgPath" />
					</svg>
					<font-awesome-icon
						v-else
						:icon="skill.icon"
						class="text-base"
						:style="{ color: skill.color }" />
				</div>

				<div
					v-if="draggedSkillIndex === Number(index)"
					class="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium"
					:style="{
						background: `${skill.color}20`,
						color: skill.color,
						border: `1px solid ${skill.color}40`,
					}">
					{{ skill.name }}
				</div>
			</div>
		</div>

		<DiscordModal
			:isOpen="showDiscordModal"
			:username="discordUsername"
			:profileUrl="discordProfileUrl"
			@close="showDiscordModal = false" />

		<div class="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
			<div
				class="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
				<div class="animate-scroll h-1.5 w-1 rounded-full bg-primary"></div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DiscordModal from './popup/DiscordModal.vue'
import { useSkillOrbit } from '../composables/useSkillOrbit'
import { useMobileSkillPhysics } from '../composables/useMobileSkillPhysics'

const props = defineProps({
	data: Object,
})

const typewriterText = ref('')
const showDiscordModal = ref(false)
const discordUsername = ref('')
const discordProfileUrl = ref('')
const orbitContainer = ref<HTMLElement | null>(null)
const mobilePlaygroundRef = ref<HTMLElement | null>(null)

const texts = ['Full Stack Developer', 'Linux Enthusiast', 'Mobile Developer', 'Problem Solver', 'em-dash lover']
let textIndex = 0
let charIndex = 0
let isDeleting = false

const floatingSkills = computed(() => {
	if (!props.data?.skills) return []
	return props.data.skills.flatMap((cat: any) => cat.technologies).slice(0, 12)
})

const { setHovered, getIconStyle, getExpandDirection } = useSkillOrbit(floatingSkills)
const { bodies, centerGlowIntensity, getBodyStyle, getBodyGlowIntensity } = useMobileSkillPhysics(
	floatingSkills,
	mobilePlaygroundRef
)

const draggedSkillIndex = computed(() => {
	const idx = bodies.value.findIndex((b) => b.isDragging)
	return idx >= 0 ? idx : null
})

const springLineCenter = ref({ x: 0, y: 0 })
const springLineEnd = ref({ x: 0, y: 0 })
let springLineFrame: number | null = null

const updateSpringLine = () => {
	if (mobilePlaygroundRef.value) {
		const rect = mobilePlaygroundRef.value.getBoundingClientRect()
		springLineCenter.value = {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		}
		if (draggedSkillIndex.value !== null) {
			const body = bodies.value[draggedSkillIndex.value]
			springLineEnd.value = {
				x: rect.left + (body?.x ?? 0),
				y: rect.top + (body?.y ?? 0),
			}
		}
	}
	springLineFrame = requestAnimationFrame(updateSpringLine)
}

const openDiscordModal = (social: any) => {
	discordUsername.value = social.username || 'fixeq.dev'
	discordProfileUrl.value = social.url
	showDiscordModal.value = true
}

onMounted(() => {
	springLineFrame = requestAnimationFrame(updateSpringLine)

	const type = () => {
		const currentText = texts[textIndex]

		if (isDeleting) {
			typewriterText.value = currentText.substring(0, charIndex - 1)
			charIndex--
		} else {
			typewriterText.value = currentText.substring(0, charIndex + 1)
			charIndex++
		}

		let timeout = isDeleting ? 50 : 150

		if (!isDeleting && charIndex === currentText.length) {
			timeout = 2000
			isDeleting = true
		} else if (isDeleting && charIndex === 0) {
			isDeleting = false
			textIndex = (textIndex + 1) % texts.length
			timeout = 500
		}

		setTimeout(type, timeout)
	}

	type()
})

onUnmounted(() => {
	if (springLineFrame) cancelAnimationFrame(springLineFrame)
})
</script>

<style scoped>
.orbit-anchor {
	width: 0;
	height: 0;
}

.skill-icon {
	left: 0;
	top: 0;
	z-index: 1;
	transition:
		transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
		z-index 0s;
}

.skill-icon:hover {
	z-index: 10;
}

.skill-card:hover {
	transform: scale(1.08);
}

@keyframes scroll {
	0% {
		transform: translateY(0);
		opacity: 1;
	}
	100% {
		transform: translateY(6px);
		opacity: 0;
	}
}

.animate-scroll {
	animation: scroll 1.5s ease-in-out infinite;
}

.typewriter {
	font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
</style>
