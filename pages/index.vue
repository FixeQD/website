<template>
	<div class="relative min-h-screen">
		<!-- Three.js animated background -->
		<ThreeBackground />

		<AppHeader />

		<main>
			<HeroSection :data="data" />
			<AboutSection :data="data" />
			<ProjectsSection :projects="projects" />
		</main>

		<AppFooter :data="data" />

		<!-- Back to top button -->
		<button
			@click="scrollToTop"
			v-show="showBackToTop"
			class="group fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/50">
			<font-awesome-icon
				icon="arrow-up"
				class="h-6 w-6 transition-transform group-hover:scale-110" />
		</button>
	</div>
</template>

<script setup>
const { data, projects, fetchData } = usePortfolioData()
const showBackToTop = ref(false)

await fetchData()

onMounted(() => {
	const handleScroll = () => {
		showBackToTop.value = window.scrollY > 500
	}

	window.addEventListener('scroll', handleScroll)

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
	})
})

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
