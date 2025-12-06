<template>
  <div class="min-h-screen relative">
    <!-- Three.js animated background -->
    <ThreeBackground />
    
    <AppHeader />
    
    <main>
      <HeroSection :data="data" />
      <AboutSection :data="data" />
      <SkillsSection :data="data" />
      <ProjectsSection :projects="projects" />
    </main>
    
    <AppFooter :data="data" />
    
    <!-- Back to top button -->
    <button @click="scrollToTop" 
            v-show="showBackToTop"
            class="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group">
      <font-awesome-icon icon="arrow-up" class="w-6 h-6 group-hover:scale-110 transition-transform" />
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
