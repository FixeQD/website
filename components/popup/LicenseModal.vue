<template>
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="isOpen"
				@click="closeModal"
				class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
				<div
					@click.stop
					class="mx-4 w-full max-w-2xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
					<div class="mb-6 flex items-center justify-between">
						<h3 class="flex items-center gap-3 text-2xl font-bold text-white">
							<font-awesome-icon icon="scale-balanced" class="text-primary" />
							MIT License
						</h3>
						<button
							@click="closeModal"
							class="text-gray-400 transition hover:text-white">
							<font-awesome-icon icon="times" class="h-6 w-6" />
						</button>
					</div>

					<div class="mb-6 grid grid-cols-3 gap-4">
						<div class="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
							<p class="mb-1 text-xs text-green-400">Permissions</p>
							<ul class="space-y-1 text-xs text-green-300">
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="check" class="h-3 w-3" />
									Commercial use
								</li>
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="check" class="h-3 w-3" />
									Modification
								</li>
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="check" class="h-3 w-3" />
									Distribution
								</li>
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="check" class="h-3 w-3" />
									Private use
								</li>
							</ul>
						</div>
						<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
							<p class="mb-1 text-xs text-red-400">Limitations</p>
							<ul class="space-y-1 text-xs text-red-300">
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="times" class="h-3 w-3" />
									Liability
								</li>
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="times" class="h-3 w-3" />
									Warranty
								</li>
							</ul>
						</div>
						<div class="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
							<p class="mb-1 text-xs text-blue-400">Conditions</p>
							<ul class="space-y-1 text-xs text-blue-300">
								<li class="flex items-center gap-1">
									<font-awesome-icon icon="info-circle" class="h-3 w-3" />
									License notice
								</li>
							</ul>
						</div>
					</div>

					<div
						class="max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-4">
						<pre
							class="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300"
							>{{ licenseText }}</pre
						>
					</div>

					<div class="mt-6 flex justify-end">
						<button
							@click="closeModal"
							class="rounded-lg bg-primary/20 px-6 py-2 font-semibold text-primary transition hover:bg-primary/30">
							Close
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
const props = defineProps({
	isOpen: Boolean,
	ownerName: String,
})

const emit = defineEmits(['close'])

const currentYear = new Date().getFullYear()

useModalOpen(toRef(props, 'isOpen'))

const licenseText = computed(
	() => `MIT License

Copyright (c) ${currentYear} Paweł

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
)

const closeModal = () => {
	emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
	transform: scale(0.95);
}
</style>
