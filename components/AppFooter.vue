<template>
	<footer id="contact" class="relative border-t border-white/10 px-6 py-16">
		<div class="container mx-auto max-w-3xl text-center">
			<h2 class="mb-10 font-display text-5xl font-bold">
				Get in
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Touch</span
				>
			</h2>

			<div class="mb-12 flex flex-wrap justify-center gap-3">
				<a
					href="mailto:meow@fixeq.me"
					class="flex items-center gap-2.5 rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 transition-all duration-300 hover:border-white/20 hover:text-white">
					<font-awesome-icon icon="envelope" class="h-4 w-4" />
					<span>E-mail</span>
				</a>
				<component
					v-for="social in data?.socials"
					:key="social.name"
					:is="social.name === 'Discord' ? 'button' : 'a'"
					:href="social.name !== 'Discord' ? social.url : undefined"
					:target="social.name !== 'Discord' ? '_blank' : undefined"
					:rel="social.name !== 'Discord' ? 'noopener' : undefined"
					@click="social.name === 'Discord' ? openDiscordModal(social) : null"
					class="flex items-center gap-2.5 rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 transition-all duration-300 hover:border-white/20 hover:text-white">
					<font-awesome-icon :icon="['fab', social.icon]" class="h-4 w-4" />
					<span>{{ social.name }}</span>
				</component>
			</div>

			<DiscordModal
				:isOpen="showDiscordModal"
				:username="discordUsername"
				:profileUrl="discordProfileUrl"
				@close="showDiscordModal = false" />

			<LicenseModal
				:isOpen="showLicenseModal"
				:ownerName="data?.developer?.name"
				@close="showLicenseModal = false" />

			<div class="border-t border-white/10 pt-8 text-sm text-gray-600">
				<p class="mb-2">&copy; {{ currentYear }} {{ data?.developer?.name }}</p>
				<p class="mb-3">
					Built with <span class="text-primary">Nuxt 3</span>,
					<span class="text-secondary">Tailwind CSS</span> &amp;
					<span class="text-primary">Three.js</span> and ofc
					<font-awesome-icon icon="heart" class="text-red-500" /> on
					<button
						@click="showLicenseModal = true"
						class="inline-flex items-center gap-1 transition hover:text-primary">
						<font-awesome-icon icon="scale-balanced" class="h-3 w-3" />
						MIT License
					</button>
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref } from 'vue'
import DiscordModal from './popup/DiscordModal.vue'
import LicenseModal from './popup/LicenseModal.vue'

defineProps({
	data: Object,
})

const currentYear = new Date().getFullYear()

const showDiscordModal = ref(false)
const discordUsername = ref('')
const discordProfileUrl = ref('')
const showLicenseModal = ref(false)

const openDiscordModal = (social) => {
	discordUsername.value = social.username || 'fixeq.dev'
	discordProfileUrl.value = social.url
	showDiscordModal.value = true
}
</script>
