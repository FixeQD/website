import { defineNuxtConfig } from 'nuxt/config'

// https://nuxtseo.com/og-image/getting-started/installation
import type { BuildOptions } from 'vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',

	runtimeConfig: {
		public: {
			siteUrl: 'https://fixeq.me',
		},
	},
	devtools: { enabled: false },
	devServer: {
		host: '0.0.0.0',
		port: 3001,
	},

	nitro: {
		prerender: {
			routes: ['/'],
		},
		compressPublicAssets: {
			gzip: true,
			brotli: true,
		},
		minify: true,
	},

	modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', 'nuxt-og-image'],

	sourcemap: false,

	vite: {
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
					passes: 3,
					pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
					dead_code: true,
					collapse_vars: true,
					reduce_vars: true,
					booleans_as_integers: true,
					unsafe_arrows: true,
					unsafe_methods: true,
				},
				mangle: {
					toplevel: true,
					safari10: false,
				},
				format: {
					comments: false,
				},
			},
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							if (id.includes('vue') || id.includes('@vue')) return 'vue-vendor'
							if (id.includes('@fortawesome')) return 'icons'
							return 'vendor'
						}
					},
					chunkFileNames: '_nuxt/[hash].js',
					entryFileNames: '_nuxt/[hash].js',
					assetFileNames: '_nuxt/[hash].[ext]',
				},
			},
			cssMinify: true,
			reportCompressedSize: false,
			chunkSizeWarningLimit: 1000,
		} as BuildOptions,
		optimizeDeps: {
			include: ['vue', 'vue-router'],
		},
	},

	experimental: {
		payloadExtraction: false,
		renderJsonPayloads: true,
		treeshakeClientOnly: true,
	},

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
				{ name: 'twitter:image:alt', content: 'FixeQ' },
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
				},
				{ rel: 'canonical', href: 'https://fixeq.me' },
			],
		},
	},

	css: ['@fortawesome/fontawesome-svg-core/styles.css'],
})
