<template>
  <header class="fixed top-0 w-full bg-dark/60 backdrop-blur-xl border-b border-white/10 z-50 shadow-lg">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <a href="#home" class="text-2xl md:text-3xl font-display font-bold">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300">
            FixeQ
          </span>
        </a>
        <div class="hidden md:flex gap-8">
          <a v-for="link in links" :key="link.href" :href="link.href" 
             class="relative text-gray-300 hover:text-primary transition-colors duration-300 font-medium group">
            {{ link.label }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
        
        <!-- Mobile menu button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-300 hover:text-primary">
          <font-awesome-icon :icon="mobileMenuOpen ? 'times' : 'bars'" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="md:hidden mt-4 pb-4 space-y-4">
        <a v-for="link in links" :key="link.href" :href="link.href" 
           @click="mobileMenuOpen = false"
           class="block text-gray-300 hover:text-primary transition-colors duration-300 font-medium">
          {{ link.label }}
        </a>
      </div>
    </nav>
  </header>
</template>

<script setup>
const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' }
]

const mobileMenuOpen = ref(false)
</script>
