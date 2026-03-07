<template>
	<div
		style="
			width: 1200px;
			height: 630px;
			background: #0a0a0f;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 80px 100px;
			position: relative;
			overflow: hidden;
		">
		<!-- Background grid decoration -->
		<div
			style="
				position: absolute;
				inset: 0;
				background-image:
					linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
				background-size: 60px 60px;
			" />

		<!-- Cyan glow blob left -->
		<div
			style="
				position: absolute;
				top: -100px;
				left: -100px;
				width: 500px;
				height: 500px;
				background: radial-gradient(circle, rgba(0, 217, 255, 0.08) 0%, transparent 70%);
				border-radius: 9999px;
			" />

		<!-- Pink glow blob right -->
		<div
			style="
				position: absolute;
				bottom: -100px;
				right: 200px;
				width: 400px;
				height: 400px;
				background: radial-gradient(circle, rgba(255, 0, 128, 0.06) 0%, transparent 70%);
				border-radius: 9999px;
			" />

		<!-- Left: text content -->
		<div style="display: flex; flex-direction: column; gap: 0; position: relative; z-index: 1">
			<!-- Tagline -->
			<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px">
				<div style="width: 6px; height: 6px; border-radius: 9999px; background: #00d9ff" />
				<span
					style="
						color: #00d9ff;
						font-size: 18px;
						letter-spacing: 2px;
						text-transform: uppercase;
					">
					Website
				</span>
			</div>

			<!-- Name -->
			<div
				style="
					font-size: 88px;
					font-weight: 900;
					color: #00d9ff;
					line-height: 1;
					margin-bottom: 16px;
					letter-spacing: -2px;
				">
				{{ name }}
			</div>

			<!-- Title -->
			<div
				style="
					font-size: 26px;
					color: #9ca3af;
					margin-bottom: 40px;
					max-width: 480px;
					line-height: 1.4;
				">
				{{ title }}
			</div>

			<!-- URL pill -->
			<div
				style="
					display: flex;
					align-items: center;
					gap: 10px;
					padding: 10px 24px;
					border: 1px solid rgba(0, 217, 255, 0.3);
					border-radius: 9999px;
					width: fit-content;
					background: rgba(0, 217, 255, 0.05);
				">
				<div style="width: 8px; height: 8px; border-radius: 9999px; background: #00d9ff" />
				<span style="color: #00d9ff; font-size: 20px">fixeq.me</span>
			</div>
		</div>

		<!-- Right: avatar -->
		<div
			style="
				position: relative;
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: center;
			">
			<!-- Glow ring -->
			<div
				style="
					position: absolute;
					width: 280px;
					height: 280px;
					border-radius: 9999px;
					background: radial-gradient(
						circle,
						rgba(0, 217, 255, 0.15) 0%,
						transparent 70%
					);
				" />
			<img
				:src="avatar"
				style="
					width: 220px;
					height: 220px;
					border-radius: 9999px;
					border: 3px solid rgba(0, 217, 255, 0.6);
					position: relative;
				" />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	name: string
	title: string
	avatar: string
}>()
</script>
