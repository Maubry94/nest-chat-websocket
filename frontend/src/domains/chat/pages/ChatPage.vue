<script setup lang="ts">
import { useRouteParams } from "@/composables/useRouteParams";
import { z } from "zod";
import type { Conversation } from "@/schemas/conversationSchema";
import { conversations } from "@/mocks/conversations";
import { computed, ref } from "vue";
import type { Message } from "@/schemas/messageSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";
import TheMessage from "../components/TheMessage.vue";
import IsTyping from "../components/IsTyping.vue";
import MessageBox from "../components/MessageBox.vue";

const params = useRouteParams({
	id: z.string(),
});

// Mock des conversations et messages
const convs = ref<Conversation[]>(conversations);
// End Mock

const conversation = computed(() => convs.value.find((conv) => conv.id === params.value.id));
const messages = computed(() => conversation.value?.messages ?? []);
const chatName = computed(() => conversation.value?.name ?? "");

function sendMessage(content: string) {
	if (!content.trim() || !conversation.value) {
		return;
	}
	const newMsg: Message = {
		sender: "you",
		user: "Vous",
		content,
		createdAt: new Date().toISOString(),
	};
	conversation.value.messages.push(newMsg);
	conversation.value.lastMessage = newMsg;
}
</script>

<template>
	<section class="h-full flex flex-col bg-background">
		<ChatHeader :chat-name="chatName" />

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

		<div class="relative shrink-0 pb-4">
			<IsTyping
				:users="['Bob', 'Clove', 'Alice']"
				class="absolute -top-8 z-10"
			/>

			<MessageBox @send="sendMessage" />
		</div>
	</section>
</template>
