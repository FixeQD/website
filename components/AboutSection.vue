<template>
  <section id="about" class="py-20 px-6 relative">
    <div class="container mx-auto max-w-5xl">
      <h2 class="text-5xl font-display font-bold text-center mb-4">
        About <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Me</span>
      </h2>
      <p class="text-center text-gray-400 mb-12">Get to know me better</p>
      
      <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
        <!-- Animated border gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
        
        <div class="relative z-10">
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-4 text-center max-w-3xl mx-auto">
            {{ data?.developer?.description }}
          </p>
          <p class="text-base text-gray-400 text-center mb-10 italic">
            Also loves to <span class="text-primary font-semibold">vibecode</span> – coding with AI assistance and good vibes ✨🤖
          </p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div v-for="(stat, idx) in stats" :key="stat.label" 
                 class="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group/stat"
                 :style="{ animationDelay: `${idx * 100}ms` }">
              <div class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-3 group-hover/stat:scale-110 transition-transform">
                {{ stat.value }}
              </div>
              <div class="text-sm md:text-base text-gray-400 group-hover/stat:text-gray-300 transition-colors">{{ stat.label }}</div>
            </div>
          </div>
          
          <!-- Achievements -->
          <div class="mt-12 grid md:grid-cols-2 gap-4">
            <div v-for="achievement in data?.achievements" :key="achievement.title"
                 class="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all duration-300 group/achievement">
              <div class="text-3xl">{{ achievement.icon }}</div>
              <div>
                <h4 class="font-bold text-lg mb-1 group-hover/achievement:text-primary transition-colors">{{ achievement.title }}</h4>
                <p class="text-sm text-gray-400">{{ achievement.description }}</p>
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

const stats = computed(() => [
  { label: 'Experience', value: props.data?.developer?.experience },
  { label: 'Projects', value: props.data?.developer?.projectsCompleted },
  { label: 'Technologies', value: props.data?.developer?.technologiesMastered },
  { label: 'Location', value: '🇵🇱' }
])
</script>
