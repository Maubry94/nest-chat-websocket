<script setup lang="ts">
import { computed } from "vue";
import UserAvatar from "@/domains/user/components/UserAvatar.vue";

interface Props {
	sender: "you" | "them";
	user: string;
	content: string;
	createdAt: string;
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
	const date = new Date(props.createdAt);

	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
});
</script>

<template>
	<div
		class="mb-4 flex items-end gap-2"
		:class="sender === 'you' ? 'flex-row-reverse justify-end' : 'justify-start'"
	>
		<UserAvatar url="https://picsum.photos/200" />

		<div
			class="flex-1 flex flex-col"
			:class="sender === 'you' ? 'items-end' : 'items-start'"
		>
			<div class="mb-1 flex gap-2 items-center text-sm text-muted-foreground">
				<span class="font-medium">{{ user }}</span>

				<span class="text-xs">{{ formattedDate }}</span>
			</div>

			<div
				class="max-w-[80%] px-4 py-3 break-words rounded-lg shadow-sm"
				:class="sender === 'you' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground'"
			>
				{{ content }}
			</div>
		</div>
	</div>
</template>
