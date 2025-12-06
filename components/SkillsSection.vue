<template>
  <section id="skills" class="py-20 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent relative overflow-hidden">
    <!-- Animated background grid -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
    
    <div class="container mx-auto max-w-6xl relative z-10">
      <h2 class="text-5xl font-display font-bold text-center mb-4">
        My <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Skills</span>
      </h2>
      <p class="text-center text-gray-400 mb-12">Technologies I love to work with</p>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div v-for="(category, idx) in data?.skills" :key="category.category" 
             class="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20"
             :style="{ animationDelay: `${idx * 100}ms` }">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-lg">
              {{ getCategoryIcon(category.category) }}
            </div>
            <h3 class="text-2xl font-bold group-hover:text-primary transition-colors">{{ category.category }}</h3>
          </div>
          
          <div class="space-y-5">
            <div v-for="tech in category.technologies" :key="tech.name" class="group/tech">
              <div class="flex justify-between mb-2">
                <span class="flex items-center gap-2 text-gray-300 group-hover/tech:text-white transition-colors">
                  <span class="text-xl">{{ tech.icon }}</span>
                  <span class="font-medium">{{ tech.name }}</span>
                </span>
              </div>
              <div class="h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                     :class="inView ? 'animate-shimmer' : ''"
                     :style="{ 
                       width: `${inView ? tech.level : 0}%`,
                       background: `linear-gradient(90deg, ${tech.color}, ${adjustColor(tech.color, 40)})`
                     }">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
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

const inView = ref(false)
const displayedLevels = ref({})
const timers = ref([])

const getCategoryIcon = (category) => {
  const icons = {
    'Frontend Development': '🎨',
    'Backend Development': '⚙️',
    'Mobile Development': '📱',
    'Tools & DevOps': '🛠️'
  }
  return icons[category] || '💻'
}

const adjustColor = (color, amount) => {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount)
  const b = Math.min(255, (num & 0x0000FF) + amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !inView.value) {
        inView.value = true
        animateLevels()
      }
    })
  }, { threshold: 0.2 })
  
  const section = document.getElementById('skills')
  if (section) observer.observe(section)
})

onUnmounted(() => {
  // Clean up all timers
  timers.value.forEach(timer => clearInterval(timer))
  timers.value = []
})

const animateLevels = () => {
  if (!props.data?.skills) return
  
  props.data.skills.forEach(category => {
    category.technologies.forEach(tech => {
      const key = `${category.category}-${tech.name}`
      let current = 0
      const target = tech.level
      const increment = target / 50
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          displayedLevels.value[key] = target
          clearInterval(timer)
          timers.value = timers.value.filter(t => t !== timer)
        } else {
          displayedLevels.value[key] = Math.floor(current)
        }
      }, 20)
      
      timers.value.push(timer)
    })
  })
}
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer::before {
  animation: shimmer 2s infinite;
}
</style>
