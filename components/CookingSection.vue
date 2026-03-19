<template>
	<section id="big-project" class="relative overflow-hidden px-6 py-32">
		<div
			class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-20">
			<div
				class="h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-tr from-primary to-secondary blur-[120px]"></div>
		</div>

		<div class="container relative z-10 mx-auto max-w-4xl">
			<div
				class="group relative rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-2xl transition-all duration-700 hover:border-white/20 hover:shadow-[0_0_40px_rgba(0,217,255,0.15)] md:p-12">
				<div
					class="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>

				<div
					class="pointer-events-none absolute -inset-[1px] z-0 rounded-3xl bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-15"></div>

				<div class="relative z-10 flex flex-col items-center justify-center text-center">
					<div
						class="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 shadow-[0_0_15px_rgba(0,217,255,0.2)] backdrop-blur-md">
						<span class="relative flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
							<span
								class="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
						</span>
						<span class="text-xs font-bold uppercase tracking-[0.2em] text-primary"
							>In The Lab</span
						>
					</div>

					<h2
						class="mb-6 font-display text-4xl font-black uppercase leading-none tracking-tighter text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
						Actually
						<span
							class="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text pr-2 italic text-transparent"
							>Cooking</span
						><br />Something
						<span
							class="bg-gradient-to-br from-white to-gray-600 bg-clip-text text-transparent"
							>BIG</span
						>
					</h2>

					<p
						class="mb-14 max-w-2xl text-base font-light leading-relaxed text-gray-400 md:text-lg">
						Not ready to talk about it yet. But it's real, it's moving, and when it
						drops you'll know...
					</p>

					<div
						class="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl transition-colors duration-500 group-hover:border-white/20 md:p-10">
						<div
							class="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-secondary/80 px-6 py-1.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_20px_rgba(255,0,128,0.4)] backdrop-blur-md">
							Dropping Soon
						</div>

						<div class="relative z-10 mt-3 grid grid-cols-4 gap-3 md:gap-5">
							<div
								v-for="(unit, index) in timeUnits"
								:key="index"
								class="flex flex-col items-center">
								<div
									class="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent shadow-inner before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100 md:rounded-2xl">
									<span
										class="font-display text-3xl font-black tabular-nums tracking-tighter text-white/30 drop-shadow-md md:text-6xl">
										{{ isStarted ? unit.value : '--' }}
									</span>
									<div
										class="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay">
										<div
											class="h-full w-full bg-[repeating-linear-gradient(transparent_0px,transparent_2px,rgba(0,0,0,0.5)_2px,rgba(0,0,0,0.5)_4px)]"></div>
									</div>
								</div>
								<span
									class="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 md:text-xs">
									{{ unit.label }}
								</span>
							</div>
						</div>

						<div
							class="mt-8 flex items-center justify-center gap-3 font-mono text-sm tracking-wide text-gray-500">
							<div class="h-px w-8 bg-gray-800"></div>
							<span class="flex items-center gap-2 text-xs uppercase">
								<svg
									class="h-4 w-4 text-secondary opacity-80"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
								</svg>
								ETA unknown. trust the process.
							</span>
							<div class="h-px w-8 bg-gray-800"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Timer properties
const isStarted = ref(false)
const targetDateStr = ref('') // Format: 'YYYY-MM-DDTHH:mm:ss'

const timeUnits = ref([
	{ label: 'Days', value: '00' },
	{ label: 'Hours', value: '00' },
	{ label: 'Minutes', value: '00' },
	{ label: 'Seconds', value: '00' },
])

let timerInterval = null

const updateTimer = () => {
	if (!isStarted.value || !targetDateStr.value) return

	const target = new Date(targetDateStr.value).getTime()
	const now = new Date().getTime()
	const distance = target - now

	if (distance <= 0) {
		clearInterval(timerInterval)
		timeUnits.value = [
			{ label: 'Days', value: '00' },
			{ label: 'Hours', value: '00' },
			{ label: 'Minutes', value: '00' },
			{ label: 'Seconds', value: '00' },
		]
		return
	}

	const days = Math.floor(distance / (1000 * 60 * 60 * 24))
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((distance % (1000 * 60)) / 1000)

	timeUnits.value = [
		{ label: 'Days', value: days.toString().padStart(2, '0') },
		{ label: 'Hours', value: hours.toString().padStart(2, '0') },
		{ label: 'Minutes', value: minutes.toString().padStart(2, '0') },
		{ label: 'Seconds', value: seconds.toString().padStart(2, '0') },
	]
}

const startSequence = (dateString) => {
	targetDateStr.value = dateString
	isStarted.value = true
	updateTimer()
	timerInterval = setInterval(updateTimer, 1000)
}

onMounted(() => {
	if (targetDateStr.value && targetDateStr.value !== '') {
		startSequence(targetDateStr.value)
	}
})

onUnmounted(() => {
	if (timerInterval) {
		clearInterval(timerInterval)
	}
})
</script>
