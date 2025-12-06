<template>
	<section
		id="home"
		class="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
		<!-- Animated gradient background -->
		<div
			class="animate-pulse-slow absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

		<!-- Code symbols and geometric shapes floating -->
		<div class="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
			<div
				v-for="(symbol, i) in codeSymbols"
				:key="i"
				class="animate-float absolute font-mono text-2xl text-primary/40 md:text-4xl"
				:style="{
					left: `${Math.random() * 100}%`,
					top: `${Math.random() * 100}%`,
					animationDelay: `${Math.random() * 5}s`,
					animationDuration: `${Math.random() * 15 + 10}s`,
				}">
				{{ symbol }}
			</div>
		</div>

		<div class="relative z-10 space-y-6 px-6 text-center">
			<!-- Avatar with glow effect -->
			<div class="group relative mx-auto mb-8 h-40 w-40">
				<div
					class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary to-secondary opacity-50 blur-xl transition-opacity group-hover:opacity-75"></div>
				<div
					class="relative h-full w-full overflow-hidden rounded-full border-4 border-primary shadow-2xl shadow-primary/50">
					<img
						:src="data?.developer?.avatar || '/avatar.jpg'"
						:alt="data?.developer?.name"
						class="h-full w-full object-cover" />
				</div>
			</div>

			<!-- Glitch effect title -->
			<h1 class="relative font-display text-6xl font-bold md:text-8xl">
				<span class="glitch-text text-primary" data-text="FixeQ">
					{{ data?.developer?.nickname || 'FixeQ' }}
				</span>
			</h1>

			<!-- Typewriter subtitle -->
			<div class="flex h-12 items-center justify-center text-2xl text-gray-300 md:text-3xl">
				<span ref="typewriterRef" class="typewriter border-r-2 border-primary pr-1">{{
					typewriterText
				}}</span>
			</div>

			<p class="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
				{{ data?.developer?.tagline }}
			</p>

			<!-- Social links with hover effects -->
			<div class="flex justify-center gap-4 pt-8">
				<component
					v-for="social in data?.socials"
					:key="social.name"
					:is="social.name === 'Discord' ? 'button' : 'a'"
					:href="social.name !== 'Discord' ? social.url : undefined"
					:target="social.name !== 'Discord' ? '_blank' : undefined"
					:rel="social.name !== 'Discord' ? 'noopener' : undefined"
					@click="social.name === 'Discord' ? openDiscordModal(social) : null"
					class="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-white/10"
					:style="{ '--hover-color': social.color }">
					<div
						class="absolute inset-0 rounded-full bg-gradient-to-r opacity-0 blur transition-opacity group-hover:opacity-20"
						:style="{ background: social.color }"></div>
					<font-awesome-icon
						:icon="['fab', social.icon]"
						class="relative z-10 h-6 w-6 transition-transform group-hover:scale-110" />
				</component>
			</div>

			<!-- Discord Modal -->
			<DiscordModal
				:isOpen="showDiscordModal"
				:username="discordUsername"
				:profileUrl="discordProfileUrl"
				@close="showDiscordModal = false" />

			<!-- Scroll indicator -->
			<div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
				<div
					class="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-2">
					<div class="animate-scroll h-2 w-1 rounded-full bg-primary"></div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const props = defineProps({
	data: Object,
})

const typewriterRef = ref(null)
const typewriterText = ref('')
const showDiscordModal = ref(false)
const discordUsername = ref('')
const discordProfileUrl = ref('')

const codeSymbols = ['{ }', '< >', '[ ]', '( )', '/>', '=>', '...', '&&', '||', '??', '</>']

const texts = ['Full Stack Developer', 'Linux Enthusiast', 'Mobile Developer', 'Problem Solver']

let textIndex = 0
let charIndex = 0
let isDeleting = false

const openDiscordModal = (social) => {
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
.glitch-text {
	position: relative;
	display: inline-block;
	animation: glitch 3s infinite;
}

.glitch-text::before,
.glitch-text::after {
	content: attr(data-text);
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.glitch-text::before {
	animation: glitch-1 2s infinite;
	clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
	transform: translate(-2px, -2px);
}

.glitch-text::after {
	animation: glitch-2 2s infinite;
	clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
	transform: translate(2px, 2px);
}

@keyframes glitch {
	0%,
	100% {
		transform: translate(0);
	}
	20% {
		transform: translate(-2px, 2px);
	}
	40% {
		transform: translate(-2px, -2px);
	}
	60% {
		transform: translate(2px, 2px);
	}
	80% {
		transform: translate(2px, -2px);
	}
}

@keyframes glitch-1 {
	0%,
	100% {
		clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
	}
	25% {
		clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
	}
	50% {
		clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
	}
	75% {
		clip-path: polygon(0 45%, 100% 45%, 100% 80%, 0 80%);
	}
}

@keyframes glitch-2 {
	0%,
	100% {
		clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
	}
	25% {
		clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
	}
	50% {
		clip-path: polygon(0 70%, 100% 70%, 100% 100%, 0 100%);
	}
	75% {
		clip-path: polygon(0 20%, 100% 20%, 100% 65%, 0 65%);
	}
}

@keyframes float {
	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}
	50% {
		transform: translate(var(--tw-translate-x, 50px), var(--tw-translate-y, 50px)) scale(1.1);
	}
}

@keyframes scroll {
	0% {
		transform: translateY(0);
		opacity: 1;
	}
	100% {
		transform: translateY(8px);
		opacity: 0;
	}
}

.animate-float {
	animation: float 20s ease-in-out infinite;
}

.animate-scroll {
	animation: scroll 1.5s ease-in-out infinite;
}

.animate-pulse-slow {
	animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.typewriter {
	font-family: 'Courier New', monospace;
}
</style>
