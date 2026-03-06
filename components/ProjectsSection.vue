<template>
	<section id="projects" class="relative px-6 py-20">
		<div class="container mx-auto max-w-6xl">
			<h2 class="mb-12 text-center font-display text-5xl font-bold">
				Featured
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Projects</span
				>
			</h2>

			<div v-if="projects?.underConstruction" class="py-20 text-center">
				<div class="mb-6 text-8xl">🚧</div>
				<p class="text-xl text-gray-400">{{ projects.constructionMessage }}</p>
			</div>

			<div v-else class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="project in projects?.projects"
					:key="project.id"
					class="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
					@click="openModal(project)">
					<div
						class="mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-white/5 text-4xl transition-transform duration-300 group-hover:scale-105">
						💻
					</div>
					<h3
						class="mb-2 text-lg font-semibold transition-colors duration-300 group-hover:text-primary">
						{{ project.title }}
					</h3>
					<p class="mb-4 text-sm leading-relaxed text-gray-400">
						{{ project.description }}
					</p>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="tech in project.technologies"
							:key="tech"
							class="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-gray-400">
							{{ tech }}
						</span>
					</div>
				</div>
			</div>

			<ProjectModal :show="showModal" :project="selectedProject" @close="closeModal" />
		</div>
	</section>
</template>

<script setup>
import ProjectModal from './popup/ProjectModal.vue'

const props = defineProps({
	projects: Object,
})

const showModal = ref(false)
const selectedProject = ref(null)

const openModal = (project) => {
	selectedProject.value = project
	showModal.value = true
}

const closeModal = () => {
	showModal.value = false
	selectedProject.value = null
}
</script>
