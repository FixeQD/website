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
			title: 'FixeQ - Paweł Sobczak | Full Stack Developer',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{
					name: 'description',
					content:
						'Full Stack Developer specializing in modern web technologies, mobile development, and Linux systems.',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: 'data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27><text y=%27.9em%27 font-size=%2790%27>⚡</text></svg>',
				},
			],
		},
	},

	css: ['@fortawesome/fontawesome-svg-core/styles.css'],

	// Generate static site for GitHub Pages
	ssr: false,
})
