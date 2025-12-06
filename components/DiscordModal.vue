<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" @click="closeModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div @click.stop class="bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/10 backdrop-blur-xl border border-[#5865F2]/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-[#5865F2]/20">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-white flex items-center gap-2">
              <font-awesome-icon :icon="['fab', 'discord']" class="text-[#5865F2]" />
              Discord
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-white transition">
              <font-awesome-icon icon="times" class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-black/30 rounded-xl p-4 border border-white/10">
              <p class="text-sm text-gray-400 mb-2">Username</p>
              <div class="flex items-center justify-between">
                <p class="text-xl font-mono text-white">{{ username }}</p>
                <button @click="copyUsername" class="px-3 py-1 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#5865F2] rounded-lg transition text-sm">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
            
            <a :href="profileUrl" target="_blank" rel="noopener"
               class="block w-full py-3 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white rounded-lg font-semibold text-center transition shadow-lg shadow-[#5865F2]/30">
              Open Discord Profile
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  username: String,
  profileUrl: String
})

const emit = defineEmits(['close'])

const copied = ref(false)

const closeModal = () => {
  emit('close')
}

const copyUsername = async () => {
  try {
    await navigator.clipboard.writeText(props.username)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
