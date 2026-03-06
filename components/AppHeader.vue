<template>
	<div
		class="fixed left-0 right-0 z-50 flex flex-col items-center transition-all duration-500 ease-in-out"
		:class="scrolled ? 'top-3' : 'top-0'">
		<nav
			class="flex w-full items-center justify-between overflow-hidden border transition-all duration-500 ease-in-out"
			:class="scrolled ? 'rounded-2xl px-5 py-2.5' : 'rounded-none px-6 py-4'"
			:style="{
				maxWidth: scrolled ? '860px' : '100vw',
				background: scrolled ? 'rgba(10,10,15,0.75)' : 'rgba(10,10,15,0)',
				borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'transparent',
				backdropFilter: scrolled ? 'blur(8px)' : 'none',
			}">
			<a href="#home" class="font-display text-lg font-bold">
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
					FixeQ
				</span>
			</a>

			<div class="hidden items-center gap-0.5 md:flex">
				<a
					v-for="link in links"
					:key="link.href"
					:href="link.href"
					class="rounded-full px-3 py-1.5 text-sm text-gray-400 transition-colors duration-200 hover:bg-white/5 hover:text-white">
					{{ link.label }}
				</a>
			</div>

			<button
				@click="mobileMenuOpen = !mobileMenuOpen"
				class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden">
				<font-awesome-icon :icon="mobileMenuOpen ? 'times' : 'bars'" class="h-3.5 w-3.5" />
			</button>
		</nav>

		<div
			v-show="mobileMenuOpen"
			class="mt-2 w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-dark/90 p-1.5 backdrop-blur-md md:hidden">
			<a
				v-for="link in links"
				:key="link.href"
				:href="link.href"
				@click="mobileMenuOpen = false"
				class="block rounded-xl px-4 py-2.5 text-sm text-gray-400 transition-colors duration-200 hover:bg-white/5 hover:text-white">
				{{ link.label }}
			</a>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const links = [
	{ href: '#about', label: 'About' },
	{ href: '#skills', label: 'Skills' },
	{ href: '#projects', label: 'Projects' },
	{ href: '#contact', label: 'Contact' },
]

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const onScroll = () => {
	scrolled.value = window.scrollY > 60
}

onMounted(() => {
	onScroll()
	window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll)
})
</script>
