<template>
	<header
		class="fixed top-0 z-50 w-full border-b border-white/10 bg-dark/60 shadow-lg backdrop-blur-xl">
		<nav class="container mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<a href="#home" class="font-display text-2xl font-bold md:text-3xl">
					<span
						class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300 hover:from-secondary hover:to-primary">
						FixeQ
					</span>
				</a>
				<div class="hidden gap-8 md:flex">
					<a
						v-for="link in links"
						:key="link.href"
						:href="link.href"
						class="group relative font-medium text-gray-300 transition-colors duration-300 hover:text-primary">
						{{ link.label }}
						<span
							class="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
					</a>
				</div>

				<!-- Mobile menu button -->
				<button
					@click="mobileMenuOpen = !mobileMenuOpen"
					class="text-gray-300 hover:text-primary md:hidden">
					<font-awesome-icon :icon="mobileMenuOpen ? 'times' : 'bars'" class="h-6 w-6" />
				</button>
			</div>

			<!-- Mobile menu -->
			<div v-show="mobileMenuOpen" class="mt-4 space-y-4 pb-4 md:hidden">
				<a
					v-for="link in links"
					:key="link.href"
					:href="link.href"
					@click="mobileMenuOpen = false"
					class="block font-medium text-gray-300 transition-colors duration-300 hover:text-primary">
					{{ link.label }}
				</a>
			</div>
		</nav>
	</header>
</template>

<script setup>
const links = [
	{ href: '#about', label: 'About' },
	{ href: '#skills', label: 'Skills' },
	{ href: '#projects', label: 'Projects' },
	{ href: '#contact', label: 'Contact' },
]

const mobileMenuOpen = ref(false)
</script>
