<template>
  <footer id="contact" class="py-20 px-6 bg-gradient-to-t from-white/5 to-transparent border-t border-white/10 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#00D9FF10_0%,transparent_70%)] animate-pulse-slow"></div>
    
    <div class="container mx-auto max-w-4xl text-center relative z-10">
      <h2 class="text-5xl font-display font-bold mb-4">
        Get in <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
      </h2>
      
      <p class="text-xl text-gray-400 mb-12">
        Interested in working together? Let's connect!
      </p>
      
      <div class="flex flex-wrap gap-4 justify-center mb-12">
        <a v-for="social in data?.socials" :key="social.name"
           :href="social.url" target="_blank" rel="noopener"
           class="group relative px-8 py-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/10 hover:border-primary/50 rounded-xl transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-10 blur-xl transition-opacity"
               :style="{ background: social.color }"></div>
          <font-awesome-icon :icon="['fab', social.icon]" class="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
          <span class="relative z-10 font-medium group-hover:text-primary transition-colors">{{ social.name }}</span>
        </a>
      </div>
      
      <div class="pt-8 border-t border-white/10">
        <p class="text-gray-500 text-sm mb-2">
          &copy; 2024 {{ data?.developer?.name }}
        </p>
        <p class="text-gray-600 text-xs">
          Built with 💙 using <span class="text-primary">Nuxt 3</span>, <span class="text-secondary">Tailwind CSS</span> & <span class="text-primary">Three.js</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  data: Object
})
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
