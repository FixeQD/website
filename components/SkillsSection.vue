<template>
	<section
		id="skills"
		class="relative overflow-hidden bg-gradient-to-b from-transparent via-white/5 to-transparent px-6 py-20">
		<!-- Animated background grid -->
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>

		<div class="container relative z-10 mx-auto max-w-6xl">
			<h2 class="mb-4 text-center font-display text-5xl font-bold">
				My
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Skills</span
				>
			</h2>
			<p class="mb-12 text-center text-gray-400">Technologies I love to work with</p>

			<div class="grid gap-8 md:grid-cols-2">
				<div
					v-for="(category, idx) in data?.skills"
					:key="category.category"
					class="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
					:style="{ animationDelay: `${idx * 100}ms` }">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-2xl shadow-lg">
							<font-awesome-icon :icon="category.icon" class="text-white" />
						</div>
						<h3 class="text-2xl font-bold transition-colors group-hover:text-primary">
							{{ category.category }}
						</h3>
					</div>
					<div class="space-y-5">
						<div
							v-for="tech in category.technologies"
							:key="tech.name"
							class="group/tech">
							<div class="mb-2 flex justify-between">
								<span
									class="flex items-center gap-2 text-gray-300 transition-colors group-hover/tech:text-white">
									<font-awesome-icon
										:icon="tech.icon"
										class="text-xl"
										:style="{ color: tech.color }" />
									<span class="font-medium">{{ tech.name }}</span>
								</span>
							</div>
							<div class="h-2.5 overflow-hidden rounded-full bg-white/5 shadow-inner">
								<div
									class="relative h-full overflow-hidden rounded-full transition-all duration-1000 ease-out"
									:class="inView ? 'animate-shimmer' : ''"
									:style="{
										width: `${inView ? tech.level : 0}%`,
										background: `linear-gradient(90deg, ${tech.color}, ${adjustColor(tech.color, 40)})`,
									}">
									<div
										class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const props = defineProps({
	data: Object,
})

const inView = ref(false)
const displayedLevels = ref({})
const timers = ref([])

const adjustColor = (color, amount) => {
	const num = parseInt(color.replace('#', ''), 16)
	const r = Math.min(255, (num >> 16) + amount)
	const g = Math.min(255, ((num >> 8) & 0x00ff) + amount)
	const b = Math.min(255, (num & 0x0000ff) + amount)
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

onMounted(() => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !inView.value) {
					inView.value = true
					animateLevels()
				}
			})
		},
		{ threshold: 0.2 }
	)

	const section = document.getElementById('skills')
	if (section) observer.observe(section)
})

onUnmounted(() => {
	// Clean up all timers
	timers.value.forEach((timer) => clearInterval(timer))
	timers.value = []
})

const animateLevels = () => {
	if (!props.data?.skills) return

	props.data.skills.forEach((category) => {
		category.technologies.forEach((tech) => {
			const key = `${category.category}-${tech.name}`
			let current = 0
			const target = tech.level
			const increment = target / 50

			const timer = setInterval(() => {
				current += increment
				if (current >= target) {
					displayedLevels.value[key] = target
					clearInterval(timer)
					timers.value = timers.value.filter((t) => t !== timer)
				} else {
					displayedLevels.value[key] = Math.floor(current)
				}
			}, 20)

			timers.value.push(timer)
		})
	})
}
</script>

<style scoped>
@keyframes shimmer {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(100%);
	}
}

.animate-shimmer::before {
	animation: shimmer 2s infinite;
}
</style>
