<template>
	<section id="about" class="relative px-6 py-20">
		<div class="container mx-auto max-w-5xl">
			<h2 class="mb-4 text-center font-display text-5xl font-bold">
				About
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Me</span
				>
			</h2>
			<p class="mb-12 text-center text-gray-400">Get to know me better</p>

			<div
				class="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-sm md:p-12">
				<!-- Animated border gradient -->
				<div
					class="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"></div>

				<div class="relative z-10">
					<p
						class="mx-auto mb-4 max-w-3xl text-center text-lg leading-relaxed text-gray-300 md:text-xl">
						{{ data?.developer?.description }}
					</p>
					<p class="mb-10 text-center text-base italic text-gray-400">
						Also loves to <span class="font-semibold text-primary">vibecode</span> –
						coding with AI assistance and good vibes ✨🤖
					</p>

					<div class="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
						<div
							v-for="(stat, idx) in stats"
							:key="stat.label"
							class="group/stat rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-center transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20"
							:style="{ animationDelay: `${idx * 100}ms` }">
							<div
								:class="
									stat.label === 'Location'
										? 'mb-3 text-4xl font-bold text-white transition-transform group-hover/stat:scale-110 md:text-5xl'
										: 'mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent transition-transform group-hover/stat:scale-110 md:text-5xl'
								">
								{{ stat.value }}
							</div>
							<div
								class="text-sm text-gray-400 transition-colors group-hover/stat:text-gray-300 md:text-base">
								{{ stat.label }}
							</div>
						</div>
					</div>

					<!-- Achievements -->
					<div class="mt-12 grid gap-4 md:grid-cols-2">
						<div
							v-for="achievement in data?.achievements"
							:key="achievement.title"
							class="group/achievement flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-white/10">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover/achievement:scale-110"
								:style="{
									background: `linear-gradient(135deg, ${achievement.color}30, ${achievement.color}10)`,
									boxShadow: `0 4px 15px ${achievement.color}20`,
								}">
								<font-awesome-icon
									:icon="achievement.icon"
									class="text-xl"
									:style="{ color: achievement.color }" />
							</div>
							<div>
								<h4
									class="mb-1 text-lg font-bold transition-colors group-hover/achievement:text-primary">
									{{ achievement.title }}
								</h4>
								<p class="text-sm text-gray-400">{{ achievement.description }}</p>
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

const stats = computed(() => [
	{ label: 'Experience', value: props.data?.developer?.experience },
	{ label: 'Projects', value: props.data?.developer?.projectsCompleted },
	{ label: 'Technologies', value: props.data?.developer?.technologiesMastered },
	{ label: 'Location', value: '🇵🇱' },
])
</script>
