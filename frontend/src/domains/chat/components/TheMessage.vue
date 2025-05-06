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
	"rounded-lg px-4 py-3 max-w-[80%] break-words shadow-sm",
	props.sender === "you"
		? "bg-primary text-primary-foreground ml-auto"
		: "bg-accent text-accent-foreground",
));

const containerClasses = computed(() => cn(
	"flex flex-col mb-4",
	props.sender === "you" ? "items-end" : "items-start",
));
</script>

<template>
  <div :class="containerClasses">
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
      <span class="font-medium">{{ user }}</span>

      <span class="text-xs">{{ formattedDate }}</span>
    </div>

    <div :class="messageClasses">
      {{ content }}
    </div>
  </div>
</template>
