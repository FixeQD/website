<template>
	<div class="mobile-app-viewer flex justify-center">
		<div
			class="phone-frame relative rounded-3xl bg-black p-4 shadow-2xl"
			:style="{ width: width, height: height }">
			<!-- Phone notch -->
			<div
				class="absolute left-1/2 top-0 z-10 h-7 w-36 -translate-x-1/2 transform rounded-b-2xl bg-black"></div>
			<!-- Speaker -->
			<div
				class="absolute left-1/2 top-3 z-10 h-1 w-20 -translate-x-1/2 transform rounded-full bg-gray-800"></div>
			<!-- Screen -->
			<div class="phone-screen h-full w-full overflow-hidden rounded-2xl bg-white">
				<iframe
					v-if="src"
					:src="src"
					class="h-full w-full border-none"
					title="Mobile App Demo"></iframe>
				<div v-else class="flex h-full items-center justify-center text-gray-500">
					No content to display
				</div>
			</div>
			<!-- Home indicator -->
			<div
				class="absolute bottom-3 left-1/2 z-10 h-1 w-24 -translate-x-1/2 transform rounded-full bg-gray-600"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	src?: string
	width?: string
	height?: string
}

const props = withDefaults(defineProps<Props>(), {
	width: '428px',
	height: '926px',
})
</script>

<style scoped>
.phone-frame {
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.phone-screen {
	background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}
</style>
