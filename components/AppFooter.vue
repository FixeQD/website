<template>
	<footer
		id="contact"
		class="relative overflow-hidden border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent px-6 py-20">
		<!-- Animated background -->
		<div
			class="animate-pulse-slow absolute inset-0 bg-[radial-gradient(circle_at_center,#00D9FF10_0%,transparent_70%)]"></div>

		<div class="container relative z-10 mx-auto max-w-4xl text-center">
			<h2 class="mb-4 font-display text-5xl font-bold">
				Get in
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Touch</span
				>
			</h2>

			<p class="mb-12 text-xl text-gray-400">
				Interested in working together? Let's connect!
			</p>

			<div class="mb-12 flex flex-wrap justify-center gap-4">
				<component
					v-for="social in data?.socials"
					:key="social.name"
					:is="social.name === 'Discord' ? 'button' : 'a'"
					:href="social.name !== 'Discord' ? social.url : undefined"
					:target="social.name !== 'Discord' ? '_blank' : undefined"
					:rel="social.name !== 'Discord' ? 'noopener' : undefined"
					@click="social.name === 'Discord' ? openDiscordModal(social) : null"
					class="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-8 py-4 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:from-white/10 hover:to-white/20 hover:shadow-xl hover:shadow-primary/20">
					<div
						class="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 blur-xl transition-opacity group-hover:opacity-10"
						:style="{ background: social.color }"></div>
					<font-awesome-icon
						:icon="['fab', social.icon]"
						class="relative z-10 h-6 w-6 transition-transform group-hover:scale-110" />
					<span
						class="relative z-10 font-medium transition-colors group-hover:text-primary"
						>{{ social.name }}</span
					>
				</component>
			</div>

			<!-- Discord Modal -->
			<DiscordModal
				:isOpen="showDiscordModal"
				:username="discordUsername"
				:profileUrl="discordProfileUrl"
				@close="showDiscordModal = false" />

			<div class="border-t border-white/10 pt-8">
				<p class="mb-2 text-sm text-gray-500">&copy; 2024 {{ data?.developer?.name }}</p>
				<p class="text-xs text-gray-600">
					Built with 💙 using <span class="text-primary">Nuxt 3</span>,
					<span class="text-secondary">Tailwind CSS</span> &
					<span class="text-primary">Three.js</span>
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
const props = defineProps({
	data: Object,
})

const showDiscordModal = ref(false)
const discordUsername = ref('')
const discordProfileUrl = ref('')

const openDiscordModal = (social) => {
	discordUsername.value = social.username || 'fixeq.dev'
	discordProfileUrl.value = social.url
	showDiscordModal.value = true
}
</script>

<style scoped>
.animate-pulse-slow {
	animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
