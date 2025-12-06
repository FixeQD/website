<template>
  <section id="projects" class="py-20 px-6 relative">
    <div class="container mx-auto max-w-6xl">
      <h2 class="text-5xl font-display font-bold text-center mb-4">
        Featured <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>
      </h2>
      <p class="text-center text-gray-400 mb-12">Check out my latest work</p>
      
      <div v-if="projects?.underConstruction" class="text-center py-20">
        <div class="relative inline-block">
          <div class="text-8xl mb-6 animate-bounce">🚧</div>
          <div class="absolute inset-0 blur-2xl bg-primary/20 animate-pulse"></div>
        </div>
        <p class="text-2xl text-gray-400 mb-4">{{ projects.constructionMessage }}</p>
        <div class="flex gap-2 justify-center">
          <div v-for="i in 3" :key="i" class="w-3 h-3 bg-primary rounded-full animate-pulse" :style="{ animationDelay: `${i * 200}ms` }"></div>
        </div>
      </div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(project, idx) in projects?.projects" :key="project.id"
             class="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
             :style="{ animationDelay: `${idx * 100}ms` }">
          <div class="mb-4 h-40 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
            <div class="w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              💻
            </div>
          </div>
          <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{{ project.title }}</h3>
          <p class="text-gray-400 mb-4 text-sm">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in project.technologies" :key="tech"
                  class="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 hover:bg-primary/30 transition-colors">
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
  projects: Object
})
</script>
