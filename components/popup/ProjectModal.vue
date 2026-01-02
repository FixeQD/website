<template>
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="show"
				@click="$emit('close')"
				class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
				<div
					@click.stop
					class="mx-4 w-full max-w-lg rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
					<!-- Header -->
					<div class="mb-6 flex items-center justify-between">
						<h3 class="flex items-center gap-3 text-2xl font-bold text-white">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-xl">
								💻
							</div>
							{{ project?.title }}
						</h3>
						<button
							@click="$emit('close')"
							class="text-gray-400 transition hover:text-white">
							<font-awesome-icon icon="times" class="h-6 w-6" />
						</button>
					</div>

					<!-- Category badge -->
					<div class="mb-4 flex items-center gap-2">
						<span
							class="rounded-full border border-secondary/30 bg-secondary/20 px-3 py-1 text-xs capitalize text-secondary">
							{{ project?.category }}
						</span>
					</div>

					<!-- Description box -->
					<div class="mb-6 rounded-xl border border-white/10 bg-black/30 p-4">
						<p class="text-sm text-gray-300">
							{{ project?.description }}
						</p>
					</div>

					<!-- Technologies box -->
					<div class="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
						<p class="mb-2 text-xs text-primary/80">Technologies</p>
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tech in project?.technologies"
								:key="tech"
								class="rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs text-primary">
								{{ tech }}
							</span>
						</div>
					</div>

					<!-- Action buttons -->
					<div class="flex gap-4">
						<a
							v-if="project?.demoUrl"
							:href="project.demoUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary py-3 font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90">
							<font-awesome-icon :icon="['fas', 'globe']" />
							Live Demo
						</a>
						<a
							v-if="project?.githubUrl"
							:href="project.githubUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 py-3 font-semibold text-white transition hover:bg-white/20">
							<font-awesome-icon :icon="['fab', 'github']" />
							GitHub
						</a>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
const props = defineProps({
	show: Boolean,
	project: Object,
})

defineEmits(['close'])

useModalOpen(toRef(props, 'show'))
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
