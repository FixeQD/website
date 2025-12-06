<template>
  <section id="skills" class="py-20 px-6 bg-white/5">
    <div class="container mx-auto max-w-6xl">
      <h2 class="text-4xl font-display font-bold text-center mb-12">
        My <span class="text-primary">Skills</span>
      </h2>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div v-for="category in data?.skills" :key="category.category" 
             class="bg-dark/50 rounded-2xl p-6 border border-white/10">
          <h3 class="text-2xl font-bold mb-6">{{ category.category }}</h3>
          
          <div class="space-y-4">
            <div v-for="tech in category.technologies" :key="tech.name">
              <div class="flex justify-between mb-2">
                <span class="flex items-center gap-2">
                  <span>{{ tech.icon }}</span>
                  <span>{{ tech.name }}</span>
                </span>
                <span class="text-primary">{{ tech.level }}%</span>
              </div>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                     :style="{ width: `${tech.level}%` }"></div>
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
  data: Object
})
</script>
