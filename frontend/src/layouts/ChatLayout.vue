<script lang="ts" setup>
import SideBar from "@/domains/chat/components/SideBar.vue";
</script>

<template>
	<main class="h-screen flex">
		<SideBar />

		<section class="flex-1 overflow-y-auto">
			<RouterView />
		</section>
	</main>
</template>
