<script setup lang="ts">
import { computed } from "vue";

interface Props {
	users: string[];
	maxDisplay?: number;
}

const props = withDefaults(defineProps<Props>(), {
	maxDisplay: 3,
});

const CONFIG = {
	START_INDEX: 0,
	NO_USER_FOUND: 0,
	ONE_USER_FOUND: 1,
};
const displayedUsers = computed(() => props.users.slice(CONFIG.START_INDEX, props.maxDisplay));
const hasMore = computed(() => props.users.length > props.maxDisplay);

const typingText = computed(() => {
	if (displayedUsers.value.length === CONFIG.NO_USER_FOUND) {
		return "";
	}
	if (displayedUsers.value.length === CONFIG.ONE_USER_FOUND) {
		return `${displayedUsers.value[CONFIG.START_INDEX]} est en train d'écrire`;
	}
	if (hasMore.value) {
		return `${displayedUsers.value.join(", ")} et d'autres sont en train d'écrire`;
	}
	return `${displayedUsers.value.join(", ")} sont en train d'écrire`;
});
</script>

<template>
	<div
		v-if="users.length"
		class="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground select-none"
	>
		<span>{{ typingText }}</span>

		<span class="inline-flex">
			<span class="animate-bounce delay-0">.</span>

			<span class="animate-bounce delay-150">.</span>

			<span class="animate-bounce delay-300">.</span>
		</span>
	</div>
</template>
