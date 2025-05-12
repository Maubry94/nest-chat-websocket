<script setup lang="ts">
import type { Message } from "@/schemas/messageSchema";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import TheMessage from "../components/TheMessage.vue";
import MessageBox from "../components/MessageBox.vue";

// Mock data for messages
const MESS_CONF = {
	MESSAGE_SENDER_DIVISOR: 2,
	MESSAGE_SENDER_YOU_INDEX: 0,
	MESSAGE_NUMBER_OFFSET: 1,
	MESSAGE_USER_DIVISOR: 3,
	USER_INDEX_OFFSET: 1,
	TOTAL_MESSAGES: 50,
	MILLIS_IN_MINUTE: 60000,
};

const messages: Message[] = Array.from({ length: 50 }).map((_unused, index) => {
	const isYou = index % MESS_CONF.MESSAGE_SENDER_DIVISOR === MESS_CONF.MESSAGE_SENDER_YOU_INDEX;
	const messageNumber = index + MESS_CONF.MESSAGE_NUMBER_OFFSET;

	return {
		sender: isYou ? "you" : "them",
		user: isYou
			? "Vous"
			: `Utilisateur ${
				Math.floor(messageNumber / MESS_CONF.MESSAGE_USER_DIVISOR)
                + MESS_CONF.USER_INDEX_OFFSET
			}`,
		content: `Message ${messageNumber}`,
		createdAt: new Date(
			Date.now() - ((MESS_CONF.TOTAL_MESSAGES - messageNumber) * MESS_CONF.MILLIS_IN_MINUTE),
		).toISOString(),
	};
});
// End of mock data

const chatName = "Chat name";
</script>

<template>
	<section class="h-full flex flex-col bg-background">
		<header
			class="sticky top-0 z-10 px-6 py-4 flex gap-4 items-center bg-card border-b border-border"
		>
			<div class="flex flex-col">
				<span class="text-lg font-semibold">
					{{ chatName }}
				</span>

				<span class="text-xs text-muted-foreground">
					En ligne
				</span>
			</div>
		</header>

		<ScrollArea class="flex-1 px-4 overflow-y-auto">
			<div class="space-y-2">
				<TheMessage
					v-for="(message, index) in messages"
					:key="index"
					:sender="message.sender"
					:user="message.user"
					:content="message.content"
					:created-at="message.createdAt"
				/>
			</div>
		</ScrollArea>

		<div class="shrink-0 pb-4">
			<MessageBox />
		</div>
	</section>
</template>
