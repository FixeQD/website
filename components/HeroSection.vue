<template>
  <section id="home" class="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse-slow"></div>
    
    <!-- Floating elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 20" :key="i" 
           class="absolute rounded-full bg-primary/10 animate-float"
           :style="{
             width: `${Math.random() * 100 + 50}px`,
             height: `${Math.random() * 100 + 50}px`,
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${Math.random() * 10 + 10}s`
           }"></div>
    </div>
    
    <div class="text-center space-y-6 px-6 relative z-10">
      <!-- Avatar with glow effect -->
      <div class="relative w-40 h-40 mx-auto mb-8 group">
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
        <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/50">
          <img :src="data?.developer?.avatar || '/avatar.jpg'" :alt="data?.developer?.name" class="w-full h-full object-cover">
        </div>
      </div>
      
      <!-- Glitch effect title -->
      <h1 class="text-6xl md:text-8xl font-display font-bold relative">
        <span class="glitch-text text-primary" data-text="FixeQ">
          {{ data?.developer?.nickname || 'FixeQ' }}
        </span>
      </h1>
      
      <!-- Typewriter subtitle -->
      <div class="text-2xl md:text-3xl text-gray-300 h-12 flex items-center justify-center">
        <span ref="typewriterRef" class="typewriter border-r-2 border-primary pr-1">{{ typewriterText }}</span>
      </div>
      
      <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">{{ data?.developer?.tagline }}</p>
      
      <!-- Social links with hover effects -->
      <div class="flex gap-4 justify-center pt-8">
        <a v-for="social in data?.socials" :key="social.name" 
           :href="social.url" target="_blank" rel="noopener"
           class="relative group w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
           :style="{ '--hover-color': social.color }">
          <div class="absolute inset-0 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 blur transition-opacity"
               :style="{ background: social.color }"></div>
          <font-awesome-icon :icon="['fab', social.icon]" class="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
        </a>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
          <div class="w-1 h-2 bg-primary rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  data: Object
})

const typewriterRef = ref(null)
const typewriterText = ref('')

const texts = [
  'Full Stack Developer',
  'Linux Enthusiast', 
  'Mobile Developer',
  'Problem Solver'
]

let textIndex = 0
let charIndex = 0
let isDeleting = false

onMounted(() => {
  const type = () => {
    const currentText = texts[textIndex]
    
    if (isDeleting) {
      typewriterText.value = currentText.substring(0, charIndex - 1)
      charIndex--
    } else {
      typewriterText.value = currentText.substring(0, charIndex + 1)
      charIndex++
    }
    
    let timeout = isDeleting ? 50 : 150
    
    if (!isDeleting && charIndex === currentText.length) {
      timeout = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
      timeout = 500
    }
    
    setTimeout(type, timeout)
  }
  
  type()
})
</script>

<style scoped>
.glitch-text {
  position: relative;
  display: inline-block;
  animation: glitch 3s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch-1 2s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-2px, -2px);
}

.glitch-text::after {
  animation: glitch-2 2s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  transform: translate(2px, 2px);
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes glitch-1 {
  0%, 100% { clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); }
  25% { clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); }
  50% { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
  75% { clip-path: polygon(0 45%, 100% 45%, 100% 80%, 0 80%); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); }
  25% { clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%); }
  50% { clip-path: polygon(0 70%, 100% 70%, 100% 100%, 0 100%); }
  75% { clip-path: polygon(0 20%, 100% 20%, 100% 65%, 0 65%); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(var(--tw-translate-x, 50px), var(--tw-translate-y, 50px)) scale(1.1); }
}

@keyframes scroll {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(8px); opacity: 0; }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-scroll {
  animation: scroll 1.5s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.typewriter {
  font-family: 'Courier New', monospace;
}
</style>
