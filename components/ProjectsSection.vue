<template>
	<section id="projects" class="relative px-6 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-4 text-center font-display text-5xl font-bold">
				Featured
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Projects</span
				>
			</h2>
			<p class="mb-12 text-center text-gray-400">Check out my latest work</p>

			<div v-if="projects?.underConstruction" class="py-20 text-center">
				<div class="relative inline-block">
					<div class="mb-6 animate-bounce text-8xl">🚧</div>
					<div class="absolute inset-0 animate-pulse bg-primary/20 blur-2xl"></div>
				</div>
				<p class="mb-4 text-2xl text-gray-400">{{ projects.constructionMessage }}</p>
				<div class="flex justify-center gap-2">
					<div
						v-for="i in 3"
						:key="i"
						class="h-3 w-3 animate-pulse rounded-full bg-primary"
						:style="{ animationDelay: `${i * 200}ms` }"></div>
				</div>
			</div>

			<div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="(project, idx) in projects?.projects"
					:key="project.id"
					class="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
					:style="{ animationDelay: `${idx * 100}ms` }">
					<div
						class="mb-4 h-40 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
						<div
							class="flex h-full w-full items-center justify-center text-4xl transition-transform group-hover:scale-110">
							💻
						</div>
					</div>
					<h3 class="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
						{{ project.title }}
					</h3>
					<p class="mb-4 text-sm text-gray-400">{{ project.description }}</p>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="tech in project.technologies"
							:key="tech"
							class="rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/30">
							{{ tech }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const props = defineProps({
	projects: Object,
})
</script>
