<script setup lang="ts">
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import MobileNav from "@/components/MobileNav.vue";

interface Props {
	chatName?: string;
}

defineProps<Props>();
</script>

<template>
	<header
		class="sticky top-0 z-10 h-18 px-6 py-4 flex gap-4 items-center bg-card border-b border-border"
	>
		<div class="w-full flex items-center justify-between">
			<div class="flex gap-4 items-center">
				<MobileNav />

				<h2
					v-if="chatName"
					class="text-lg font-semibold"
				>
					{{ chatName }}
				</h2>

				<h1
					v-else
					class="text-2xl font-bold text-sidebar-primary"
				>
					Nestflix & Chat
				</h1>
			</div>

			<DarkModeToggle />
		</div>
	</header>
</template>
