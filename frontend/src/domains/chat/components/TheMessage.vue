<script setup lang="ts">
import UserAvatar from "@/domains/user/components/UserAvatar.vue";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { computed } from "vue";

interface Props {
	sender: string;
	content: string;
	sendAt: string;
	readAt: string | null;
}

const props = defineProps<Props>();

const { user } = useUserInformation();

const formattedDate = computed(() => {
	const date = new Date(props.sendAt);

	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
});
</script>

<template>
	<div
		class="mb-4 flex items-end gap-2"
		:class="props.sender === user?.username ? 'flex-row-reverse justify-end' : 'justify-start'"
	>
		<UserAvatar url="https://picsum.photos/200" />

		<div
			class="flex-1 flex flex-col"
			:class="props.sender === user?.username ? 'items-end' : 'items-start'"
		>
			<div class="mb-1 flex gap-2 items-center text-sm text-muted-foreground">
				<span class="font-medium">{{ props.sender === user?.username ? 'Vous' : props.sender }}</span>

				<span class="text-xs">{{ formattedDate }}</span>
			</div>

			<div
				class="max-w-[80%] px-4 py-3 break-words rounded-lg shadow-sm"
				:class="props.sender === user?.username ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground'"
			>
				{{ props.content }}
			</div>
		</div>
	</div>
</template>
