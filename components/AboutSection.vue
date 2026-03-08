<template>
	<section id="about" class="relative px-6 py-20">
		<div class="container mx-auto max-w-4xl">
			<h2 class="mb-12 text-center font-display text-5xl font-bold">
				About
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Me</span
				>
			</h2>

			<div class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
				<p
					class="mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed text-gray-300">
					{{ data?.developer?.description }}
				</p>

				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div
						v-for="stat in stats"
						:key="stat.label"
						class="rounded-xl border border-white/10 p-5 text-center transition-colors duration-300 hover:border-white/20">
						<div
							:class="
								stat.label === 'Location'
									? 'mb-2 text-3xl font-bold text-white'
									: 'mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent'
							">
							{{ stat.value }}
						</div>
						<div class="text-sm text-gray-500">{{ stat.label }}</div>
					</div>
				</div>

				<!-- GitHub Stats -->
				<div class="mt-6 rounded-xl border border-white/10 p-5">
					<div class="mb-5 flex items-center justify-between">
						<div class="flex items-center gap-2 text-sm text-gray-400">
							<font-awesome-icon :icon="['fab', 'github']" class="h-4 w-4" />
							<span>GitHub</span>
						</div>
						<a
							:href="githubUrl"
							target="_blank"
							rel="noopener"
							class="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-primary">
							<span>View profile</span>
							<font-awesome-icon icon="arrow-right" class="h-2.5 w-2.5" />
						</a>
					</div>

					<!-- Skeleton -->
					<template v-if="loading">
						<div class="mb-5 grid grid-cols-3 gap-3">
							<div
								v-for="i in 3"
								:key="i"
								class="h-16 animate-pulse rounded-lg bg-white/5"></div>
						</div>
						<div class="mb-3 h-2 animate-pulse rounded-full bg-white/5"></div>
						<div class="flex gap-4">
							<div
								v-for="i in 4"
								:key="i"
								class="h-3 w-20 animate-pulse rounded bg-white/5"></div>
						</div>
					</template>

					<template v-else-if="githubStats">
						<!-- Quick stats row -->
						<div class="mb-5 grid grid-cols-3 gap-3">
							<div
								v-for="item in quickStats"
								:key="item.label"
								class="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
								<div class="mb-1 text-xl font-bold text-white">
									{{ item.value ?? '-' }}
								</div>
								<div class="text-xs text-gray-500">{{ item.label }}</div>
							</div>
						</div>

						<!-- Language bar -->
						<div v-if="githubStats.topLanguages.length">
							<div class="mb-2 text-xs text-gray-500">Top Languages</div>
							<div
								class="mb-3 flex h-1.5 w-full overflow-hidden rounded-full bg-white/5">
								<div
									v-for="lang in githubStats.topLanguages"
									:key="lang.name"
									:style="{ width: lang.percent + '%', background: lang.color }"
									class="transition-all duration-700 first:rounded-l-full last:rounded-r-full"></div>
							</div>
							<div class="flex flex-wrap gap-x-4 gap-y-1.5">
								<div
									v-for="lang in githubStats.topLanguages"
									:key="lang.name"
									class="flex items-center gap-1.5">
									<div
										class="h-2 w-2 rounded-full"
										:style="{ background: lang.color }"></div>
									<span class="text-xs text-gray-400">{{ lang.name }}</span>
									<span class="text-xs text-gray-600">{{ lang.percent }}%</span>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>

			<!-- Achievements -->
			<div class="mt-5 flex flex-wrap justify-center gap-4">
				<div
					v-for="achievement in data?.achievements"
					:key="achievement.title"
					class="w-[calc(50%-8px)] rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-white/20 md:w-[calc(33.333%-11px)]">
					<div
						class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
						:style="{ background: `${achievement.color}20` }">
						<font-awesome-icon
							:icon="achievement.icon"
							class="h-4 w-4"
							:style="{ color: achievement.color }" />
					</div>
					<div class="mb-1 text-sm font-semibold text-white">{{ achievement.title }}</div>
					<div class="text-xs leading-relaxed text-gray-500">
						{{ achievement.description }}
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGithubStats } from '../composables/useGithubStats'

const props = defineProps({
	data: Object,
})

const stats = computed(() => [
	{ label: 'Experience', value: props.data?.developer?.experience },
	{ label: 'Projects', value: props.data?.developer?.projectsCompleted },
	{ label: 'Technologies', value: props.data?.developer?.technologiesMastered },
	{ label: 'Location', value: '🇵🇱' },
])

const githubUrl = computed(
	() => props.data?.socials?.find((s: any) => s.name === 'GitHub')?.url ?? '#'
)

const githubUsername = computed(() => githubUrl.value.replace('https://github.com/', ''))

const { stats: githubStats, loading, fetch } = useGithubStats(githubUsername.value)

const quickStats = computed(() => [
	{ label: 'Contributions', value: githubStats.value?.contributions },
	{ label: 'Commits', value: githubStats.value?.commits },
	{ label: 'Stars', value: githubStats.value?.stars },
])

onMounted(fetch)
</script>
