<template>
  <section id="about" class="py-20 px-6">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-4xl font-display font-bold text-center mb-12">
        About <span class="text-primary">Me</span>
      </h2>
      
      <div class="bg-white/5 rounded-2xl p-8 border border-white/10">
        <p class="text-lg text-gray-300 leading-relaxed mb-8">
          {{ data?.developer?.description }}
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl font-bold text-primary mb-2">{{ stat.value }}</div>
            <div class="text-sm text-gray-400">{{ stat.label }}</div>
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
