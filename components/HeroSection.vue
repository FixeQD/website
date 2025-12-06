<template>
  <section id="home" class="min-h-screen flex items-center justify-center pt-20">
    <div class="text-center space-y-6 px-6">
      <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary mb-8">
        <img :src="data?.developer?.avatar || '/avatar.jpg'" :alt="data?.developer?.name" class="w-full h-full object-cover">
      </div>
      <h1 class="text-5xl md:text-7xl font-display font-bold">
        <span class="text-primary">{{ data?.developer?.nickname || 'FixeQ' }}</span>
      </h1>
      <p class="text-xl md:text-2xl text-gray-300">{{ data?.developer?.title }}</p>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto">{{ data?.developer?.tagline }}</p>
      
      <div class="flex gap-4 justify-center pt-8">
        <a v-for="social in data?.socials" :key="social.name" 
           :href="social.url" target="_blank" rel="noopener"
           class="w-12 h-12 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary flex items-center justify-center transition">
          <Icon :name="`bi:${social.icon}`" class="w-6 h-6" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  data: Object
})
</script>
