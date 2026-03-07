import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: false },
	devServer: {
		host: '0.0.0.0',
		port: 3001,
	},

	modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],

	sourcemap: false,

	app: {
		baseURL: '/',
		head: {
			title: "FixeQ's website",
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{
					name: 'description',
					content: 'Self-taught full-stack dev from Poland. Web, mobile, Arch Linux.',
				},
				{ name: 'author', content: 'Paweł Sobczak' },
				{ name: 'robots', content: 'index, follow' },
				{ name: 'theme-color', content: '#00D9FF' },

				// Open Graph
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://fixeq.me' },
				{ property: 'og:title', content: "FixeQ's website" },
				{
					property: 'og:description',
					content: 'Self-taught full-stack dev from Poland. Web, mobile, Arch Linux.',
				},
				{ property: 'og:image', content: 'https://fixeq.me/avatar.jpg' },
				{ property: 'og:image:width', content: '1200' },
				{ property: 'og:image:height', content: '630' },
				{ property: 'og:image:alt', content: 'FixeQ' },
				{ property: 'og:site_name', content: "FixeQ's website" },
				{ property: 'og:locale', content: 'en_US' },

				// Twitter Card
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:url', content: 'https://fixeq.me' },
				{ name: 'twitter:title', content: "FixeQ's website" },
				{
					name: 'twitter:description',
					content: 'Self-taught full-stack dev from Poland. Web, mobile, Arch Linux.',
				},
				{ name: 'twitter:image', content: 'https://fixeq.me/avatar.jpg' },
				{ name: 'twitter:image:alt', content: 'FixeQ' },
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: 'data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27><text y=%27.9em%27 font-size=%2790%27>⚡</text></svg>',
				},
				{ rel: 'canonical', href: 'https://fixeq.me' },
			],
		},
	},

	css: ['@fortawesome/fontawesome-svg-core/styles.css'],

	// Generate static site for GitHub Pages
	ssr: false,
})
