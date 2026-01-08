<template>
	<section id="home" class="relative flex min-h-screen items-center overflow-hidden">
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

		<div class="container relative z-10 mx-auto grid gap-8 px-6 lg:grid-cols-2 lg:gap-12">
			<!-- Left side - Text content -->
			<div class="flex flex-col justify-center">
				<!-- Typewriter -->
				<div class="mb-6 flex h-8 items-center text-lg text-gray-400 md:text-xl">
					<span
						ref="typewriterRef"
						class="typewriter border-r-2 border-primary pr-1 text-primary"
						>{{ typewriterText }}</span
					>
				</div>

				<!-- Just the tagline -->
				<h1
					class="mb-8 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
					Crafting
					<span
						class="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
						Digital
					</span>
					Experiences
					<br />
					<span class="text-gray-400">with</span>
					<span
						class="bg-gradient-to-r from-secondary to-pink-400 bg-clip-text text-transparent">
						Code
					</span>
				</h1>

				<!-- Single CTA -->
				<div class="flex items-center gap-6">
					<a
						href="#projects"
						class="group inline-flex items-center gap-3 rounded-full border border-primary bg-primary/10 px-6 py-3 font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-dark">
						<span>See my work</span>
						<font-awesome-icon
							icon="arrow-right"
							class="transition-transform group-hover:translate-x-1" />
					</a>

					<!-- Social links inline -->
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

			<!-- Right side -->
			<div
				ref="orbitContainer"
				class="relative hidden h-[450px] lg:flex lg:items-center lg:justify-center">
				<!-- Orbital rings -->
				<div
					class="absolute h-[350px] w-[350px] animate-[spin_80s_linear_infinite] rounded-full border border-white/5"></div>
				<div
					class="absolute h-[250px] w-[250px] animate-[spin_60s_linear_infinite_reverse] rounded-full border border-white/10"></div>

				<!-- Center glow -->
				<div class="absolute h-20 w-20 rounded-full bg-primary/20 blur-2xl"></div>

				<!-- Skill icons -->
				<div
					v-for="(skill, index) in floatingSkills"
					:key="skill.name"
					class="skill-icon group absolute"
					:style="getIconStyle(Number(index))"
					@mouseenter="setHovered(Number(index))"
					@mouseleave="setHovered(null)">
					<!-- Glow effect - not hovered -->
					<div
						class="absolute inset-0 rounded-full blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-0"
						:style="{ background: skill.color, opacity: 0.4 }"></div>

					<!-- Card container -->
					<div
						class="skill-card relative flex cursor-pointer items-center gap-2 transition-all duration-500 ease-out"
						:class="[
							'group-hover:rounded-xl group-hover:border group-hover:border-white/20 group-hover:bg-dark/95 group-hover:p-2.5 group-hover:backdrop-blur-md',
							'rounded-full p-1',
						]"
						:style="{ flexDirection: getExpandDirection(Number(index)) }">
						<!-- Hover glow -->
						<div
							class="absolute inset-0 scale-0 rounded-xl opacity-0 blur-lg transition-all duration-500 group-hover:scale-110 group-hover:opacity-60"
							:style="{ background: skill.color }"></div>

						<!-- Icon -->
						<div
							class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-500"
							:style="{ background: `${skill.color}20` }">
							<font-awesome-icon
								:icon="skill.icon"
								class="text-lg transition-all duration-300 group-hover:scale-110"
								:style="{ color: skill.color }" />
						</div>

						<!-- Skill name -->
						<span
							class="skill-name relative max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:max-w-[120px] group-hover:opacity-100"
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
				class="relative mx-auto h-[220px] w-[220px] touch-none select-none lg:hidden">
				<!-- Orbital rings -->
				<div
					class="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"></div>

				<!-- Center glow -->
				<div
					class="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl transition-all duration-150"
					:style="{
						transform: `translate(-50%, -50%) scale(${1 + centerGlowIntensity * 2})`,
						opacity: 0.3 + centerGlowIntensity * 0.7,
					}"></div>

				<!-- Spring line to center when dragging -->
				<svg
					v-if="draggedSkillIndex !== null"
					class="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
					:style="{ left: 0, top: 0 }">
					<line
						:x1="springLineCenter.x"
						:y1="springLineCenter.y"
						:x2="springLineEnd.x"
						:y2="springLineEnd.y"
						:stroke="floatingSkills[draggedSkillIndex]?.color ?? '#00ff88'"
						stroke-width="2"
						stroke-dasharray="4 4"
						:opacity="0.4 + getBodyGlowIntensity(draggedSkillIndex) * 0.4" />
				</svg>

				<!-- Skill bodies -->
				<div
					v-for="(skill, index) in floatingSkills"
					:key="skill.name"
					class="absolute cursor-grab rounded-full border border-white/20 bg-dark/95 backdrop-blur-sm active:cursor-grabbing"
					:style="{
						...getBodyStyle(Number(index)),
						boxShadow:
							getBodyGlowIntensity(Number(index)) > 0
								? `0 0 ${20 * getBodyGlowIntensity(Number(index))}px ${skill.color}`
								: 'none',
					}">
					<div
						class="flex h-full w-full items-center justify-center rounded-full"
						:style="{ background: `${skill.color}20` }">
						<font-awesome-icon
							:icon="skill.icon"
							class="text-sm"
							:style="{ color: skill.color }" />
					</div>
				</div>
			</div>
		</div>

		<!-- Discord Modal -->
		<DiscordModal
			:isOpen="showDiscordModal"
			:username="discordUsername"
			:profileUrl="discordProfileUrl"
			@close="showDiscordModal = false" />

		<div class="absolute bottom-8 left-1/2 -translate-x-1/2">
			<div
				class="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
				<div class="animate-scroll h-1.5 w-1 rounded-full bg-primary"></div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DiscordModal from './popup/DiscordModal.vue'
import { useSkillOrbit } from '../composables/useSkillOrbit'
import { useMobileSkillPhysics } from '../composables/useMobileSkillPhysics'

const props = defineProps({
	data: Object,
})

const typewriterRef = ref(null)
const typewriterText = ref('')
const showDiscordModal = ref(false)
const discordUsername = ref('')
const discordProfileUrl = ref('')
const mobilePlaygroundRef = ref<HTMLElement | null>(null)

const texts = ['Full Stack Developer', 'Linux Enthusiast', 'Mobile Developer', 'Problem Solver']

let textIndex = 0
let charIndex = 0
let isDeleting = false

const floatingSkills = computed(() => {
	if (!props.data?.skills) return []
	return props.data.skills.flatMap((cat: any) => cat.technologies).slice(0, 10)
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

// calc screen coords for spring line
const springLineCenter = computed(() => {
	if (!mobilePlaygroundRef.value) return { x: 0, y: 0 }
	const rect = mobilePlaygroundRef.value.getBoundingClientRect()
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	}
})

const springLineEnd = computed(() => {
	if (draggedSkillIndex.value === null || !mobilePlaygroundRef.value) return { x: 0, y: 0 }
	const rect = mobilePlaygroundRef.value.getBoundingClientRect()
	const body = bodies.value[draggedSkillIndex.value]
	return {
		x: rect.left + (body?.x ?? 0),
		y: rect.top + (body?.y ?? 0),
	}
})

const openDiscordModal = (social: any) => {
	discordUsername.value = social.username || 'fixeq.dev'
	discordProfileUrl.value = social.url
	showDiscordModal.value = true
}

onMounted(() => {
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
</script>

<style scoped>
.skill-icon {
	left: 50%;
	top: 50%;
	z-index: 1;
	transition:
		transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
		z-index 0s;
}

.skill-icon:hover {
	z-index: 10;
}

.skill-card {
	transition:
		transform 0.3s ease,
		border-color 0.3s ease,
		background-color 0.3s ease;
}

.skill-card:hover {
	transform: scale(1.08);
	border-color: rgba(255, 255, 255, 0.25);
	background-color: rgba(10, 10, 15, 1);
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
