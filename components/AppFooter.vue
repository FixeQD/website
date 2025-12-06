<template>
  <footer id="contact" class="py-20 px-6 bg-white/5 border-t border-white/10">
    <div class="container mx-auto max-w-4xl text-center">
      <h2 class="text-4xl font-display font-bold mb-8">
        Get in <span class="text-primary">Touch</span>
      </h2>
      
      <p class="text-lg text-gray-400 mb-12">
        Interested in working together? Feel free to reach out!
      </p>
      
      <div class="flex gap-6 justify-center mb-12">
        <a v-for="social in data?.socials" :key="social.name"
           :href="social.url" target="_blank" rel="noopener"
           class="px-6 py-3 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary rounded-lg transition flex items-center gap-2">
          <Icon :name="`bi:${social.icon}`" class="w-5 h-5" />
          <span>{{ social.name }}</span>
        </a>
      </div>
      
      <div class="text-gray-500 text-sm">
        <p>&copy; 2024 {{ data?.developer?.name }}. Built with Nuxt & Tailwind CSS.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  data: Object
})
</script>
