<template>
	<section
		id="skills"
		class="relative overflow-hidden bg-gradient-to-b from-transparent via-white/5 to-transparent px-6 py-20">
		<!-- Animated background grid -->
		<div
			class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>

		<div class="container relative z-10 mx-auto max-w-6xl">
			<h2 class="mb-4 text-center font-display text-5xl font-bold">
				My
				<span
					class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
					>Skills</span
				>
			</h2>
			<p class="mb-12 text-center text-gray-400">Technologies I love to work with</p>

			<div class="grid gap-8 md:grid-cols-2">
				<div
					v-for="(category, idx) in data?.skills"
					:key="category.category"
					class="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
					:style="{ animationDelay: `${idx * 100}ms` }">
					<div class="mb-6 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-2xl shadow-lg">
							<font-awesome-icon :icon="category.icon" class="text-white" />
						</div>
						<h3 class="text-2xl font-bold transition-colors group-hover:text-primary">
							{{ category.category }}
						</h3>
					</div>
					<div class="flex flex-wrap gap-3">
						<div
							v-for="tech in category.technologies"
							:key="tech.name"
							class="group/tech relative overflow-hidden rounded-xl border border-white/10 px-4 py-3 transition-all duration-300 hover:scale-105 hover:border-white/30 hover:shadow-lg"
							:style="{
								background: `linear-gradient(135deg, ${tech.color}15 0%, ${tech.color}08 50%, transparent 100%)`,
							}">
							<div
								class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tech:opacity-100"
								:style="{
									background: `radial-gradient(circle at 50% 50%, ${tech.color}25, transparent 70%)`,
								}"></div>
							<div class="relative flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover/tech:scale-110"
									:style="{
										background: `linear-gradient(135deg, ${tech.color}30, ${tech.color}10)`,
										boxShadow: `0 4px 15px ${tech.color}20`,
									}">
									<font-awesome-icon
										:icon="tech.icon"
										class="text-lg"
										:style="{ color: tech.color }" />
								</div>
								<span
									class="font-medium text-gray-200 transition-colors group-hover/tech:text-white">
									{{ tech.name }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
defineProps({
	data: Object,
})
</script>

<style scoped></style>
