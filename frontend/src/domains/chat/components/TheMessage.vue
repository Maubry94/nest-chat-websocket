<script setup lang="ts">
import TheIcon from "@/components/TheIcon.vue";
import UserAvatar from "@/domains/user/components/UserAvatar.vue";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { getHoursAndMinutesFromDate, isTodayDate } from "@/lib/utils";
import type { Message } from "@/schemas/messageSchema";
import { computed } from "vue";

interface Props {
	message: Message;
}

const props = defineProps<Props>();

const { user } = useUserInformation();

const formattedDate = computed(() => {
	const date = new Date(props.message.sendAt);
	const hoursAndMinutesDate = getHoursAndMinutesFromDate(date);

	if (isTodayDate(date)) {
		return `Auj, ${hoursAndMinutesDate}`;
	} else {
		const fullDate = date.toLocaleDateString("fr-FR");
		return `${fullDate}, ${hoursAndMinutesDate}`;
	}
});

const formattedReadAt = computed(() => {
	if (!props.message.readAt) {
		return "Non lu";
	}

	const date = new Date(props.message.readAt);
	const hoursAndMinutesDate = getHoursAndMinutesFromDate(date);

	if (isTodayDate(date)) {
		return `Lu à ${hoursAndMinutesDate}`;
	} else {
		const fullDate = date.toLocaleDateString("fr-FR");
		return `Lu le ${fullDate} à ${hoursAndMinutesDate}`;
	}
});

const isSender = computed(() => user.value && props.message.sender.username === user.value.username);
const senderProfileColor = computed(() => props.message.sender.profileColor);
</script>

<template>
	<div
		class="py-6 flex items-center gap-2"
		:class="isSender ? 'flex-row-reverse justify-end' : 'justify-start'"
	>
		<UserAvatar :profile-color="senderProfileColor" />

		<div
			class="flex-1 flex flex-col"
			:class="isSender ? 'items-end' : 'items-start'"
		>
			<div class="mb-1 flex gap-2 items-center text-sm text-muted-foreground">
				<span class="font-medium">{{ isSender ? 'Vous' : props.message.sender.username }}</span>
			</div>

			<div
				class="max-w-[80%] px-4 py-3 break-words rounded-lg shadow-sm"
				:class="isSender ? 'bg-primary text-primary-foreground ml-auto' : 'bg-accent text-accent-foreground'"
			>
				{{ props.message.content }}
			</div>

			<div
				v-if="isSender"
				class="flex flex-col gap-1 text-xs text-muted-foreground mt-1"
				:class="!isSender && 'items-start'"
			>
				<span
					class="text-right"
				>
					{{ formattedDate }}
				</span>

				<div
					class="flex gap-1 items-center justify-end"
				>
					<TheIcon
						:name="props.message.readAt ? 'checkCheck' : 'check'"
						size="xs"
					/>

					<span>
						{{ formattedReadAt }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
