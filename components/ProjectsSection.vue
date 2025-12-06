<template>
  <section id="projects" class="py-20 px-6">
    <div class="container mx-auto max-w-6xl">
      <h2 class="text-4xl font-display font-bold text-center mb-12">
        Featured <span class="text-primary">Projects</span>
      </h2>
      
      <div v-if="projects?.underConstruction" class="text-center py-20">
        <div class="text-6xl mb-4">🚧</div>
        <p class="text-xl text-gray-400">{{ projects.constructionMessage }}</p>
      </div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects?.projects" :key="project.id"
             class="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary transition group">
          <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition">{{ project.title }}</h3>
          <p class="text-gray-400 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in project.technologies" :key="tech"
                  class="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">
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
