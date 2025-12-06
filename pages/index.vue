<template>
  <div class="min-h-screen">
    <AppHeader />
    
    <main>
      <HeroSection :data="data" />
      <AboutSection :data="data" />
      <SkillsSection :data="data" />
      <ProjectsSection :projects="projects" />
    </main>
    
    <AppFooter :data="data" />
  </div>
</template>

<script setup>
const { data, projects, fetchData } = usePortfolioData()

await fetchData()
</script>
