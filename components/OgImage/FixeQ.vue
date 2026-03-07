<template>
	<div
		style="
			width: 1200px;
			height: 630px;
			background-color: #0a0a0f;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 90px;
			font-family: Inter, sans-serif;
			position: relative;
			overflow: hidden;
		">
		<div
			style="
				position: absolute;
				left: 0;
				top: 0;
				width: 4px;
				height: 630px;
				background-color: #00d9ff;
			" />

		<div
			style="
				position: absolute;
				right: 90px;
				top: 50%;
				margin-top: -100px;
				width: 200px;
				height: 200px;
				border-radius: 9999px;
				border: 2px solid rgba(0, 217, 255, 0.5);
				overflow: hidden;
			">
			<img :src="avatar" style="width: 200px; height: 200px; border-radius: 9999px" />
		</div>

		<div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 28px">
			<span style="color: #00d9ff; font-size: 18px; font-weight: 600">~/portfolio</span>
			<span style="color: #6b7280; font-size: 18px; margin-left: 6px">on</span>
			<span style="color: #ff0080; font-size: 18px; margin-left: 6px">main</span>
			<span style="color: #6b7280; font-size: 18px; margin-left: 6px">&gt;</span>
		</div>

		<div style="display: flex; flex-direction: row; align-items: baseline; margin-bottom: 16px">
			<span
				style="
					color: #ffffff;
					font-size: 86px;
					font-weight: 900;
					line-height: 1;
					letter-spacing: -2px;
				"
				>Fixe</span
			><span
				style="
					color: #00d9ff;
					font-size: 86px;
					font-weight: 900;
					line-height: 1;
					letter-spacing: -2px;
				"
				>Q</span
			>
		</div>

		<span style="color: #6b7280; font-size: 24px; margin-bottom: 44px">{{ title }}</span>

		<!-- Tags: absolute positioned side by side -->
		<div style="position: relative; height: 40px; width: 600px">
			<div
				style="
					position: absolute;
					left: 0;
					top: 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 8px 20px;
					border: 1px solid #00d9ff;
					border-radius: 6px;
					background-color: rgba(0, 217, 255, 0.08);
				">
				<span style="color: #00d9ff; font-size: 16px; font-weight: 600">fixeq.me</span>
			</div>
			<div
				style="
					position: absolute;
					left: 130px;
					top: 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 8px 20px;
					border: 1px solid #1793d1;
					border-radius: 6px;
					background-color: rgba(23, 147, 209, 0.08);
				">
				<span style="color: #1793d1; font-size: 16px; font-weight: 600"
					>Arch Linux btw</span
				>
			</div>
			<div
				style="
					position: absolute;
					left: 300px;
					top: 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 8px 20px;
					border: 1px solid #dc143c;
					border-radius: 6px;
					background-color: rgba(220, 20, 60, 0.08);
				">
				<span style="color: #ffffff; font-size: 16px; font-weight: 600">PL</span
				><span style="color: #dc143c; font-size: 16px; font-weight: 600; margin-left: 6px"
					>Poland</span
				>
			</div>
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
