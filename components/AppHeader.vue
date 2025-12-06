<template>
  <header class="fixed top-0 w-full bg-dark/80 backdrop-blur-lg border-b border-white/10 z-50">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <a href="#home" class="text-2xl font-display font-bold text-primary">FixeQ</a>
        <div class="flex gap-6">
          <a v-for="link in links" :key="link.href" :href="link.href" 
             class="text-gray-300 hover:text-primary transition">
            {{ link.label }}
          </a>
        </div>
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
</script>
