<template>
	<div class="relative min-h-screen">
		<!-- Three.js animated background -->
		<ClientOnly>
			<ThreeBackground />
		</ClientOnly>

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
			class="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-dark/80 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:text-white">
			<font-awesome-icon icon="arrow-up" class="h-4 w-4" />
		</button>
	</div>
</template>

<script setup>
const { data, projects, fetchData } = usePortfolioData()
const showBackToTop = ref(false)

await fetchData()

defineOgImage({
	component: 'FixeQ',
	name: data.value?.developer?.nickname ?? 'FixeQ',
	title: data.value?.developer?.title ?? 'Full Stack Developer',
	avatar: 'https://fixeq.me/avatar.jpg',
})

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
