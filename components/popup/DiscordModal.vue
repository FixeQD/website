<template>
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="isOpen"
				@click="closeModal"
				class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
				<div
					@click.stop
					class="mx-4 w-full max-w-md rounded-2xl border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/10 p-8 shadow-2xl shadow-[#5865F2]/20 backdrop-blur-xl">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="flex items-center gap-2 text-2xl font-bold text-white">
							<font-awesome-icon :icon="['fab', 'discord']" class="text-[#5865F2]" />
							Discord
						</h3>
						<button
							@click="closeModal"
							class="text-gray-400 transition hover:text-white">
							<font-awesome-icon icon="times" class="h-6 w-6" />
						</button>
					</div>

					<div class="space-y-4">
						<div class="rounded-xl border border-white/10 bg-black/30 p-4">
							<p class="mb-2 text-sm text-gray-400">Username</p>
							<div class="flex items-center justify-between">
								<p class="font-mono text-xl text-white">{{ username }}</p>
								<button
									@click="copyUsername"
									class="rounded-lg bg-[#5865F2]/20 px-3 py-1 text-sm text-[#5865F2] transition hover:bg-[#5865F2]/30">
									{{ copied ? 'Copied!' : 'Copy' }}
								</button>
							</div>
						</div>

						<a
							:href="profileUrl"
							target="_blank"
							rel="noopener"
							class="block w-full rounded-lg bg-[#5865F2] py-3 text-center font-semibold text-white shadow-lg shadow-[#5865F2]/30 transition hover:bg-[#5865F2]/90">
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
	profileUrl: String,
})

const emit = defineEmits(['close'])

const copied = ref(false)

useModalOpen(toRef(props, 'isOpen'))

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
