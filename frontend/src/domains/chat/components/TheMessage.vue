<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed } from "vue";

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

const messageClasses = computed(() => cn(
	"max-w-[80%] px-4 py-3 break-words rounded-lg shadow-sm",
	props.sender === "you"
		? "bg-primary text-primary-foreground ml-auto"
		: "bg-accent text-accent-foreground",
));

const containerClasses = computed(() => cn(
	"mb-4 flex flex-col",
	props.sender === "you" ? "items-end" : "items-start",
));
</script>

<template>
	<div :class="containerClasses">
		<div class="mb-1 flex gap-2 items-center text-sm text-muted-foreground">
			<span class="font-medium">{{ user }}</span>

			<span class="text-xs">{{ formattedDate }}</span>
		</div>

		<div :class="messageClasses">
			{{ content }}
		</div>
	</div>
</template>
