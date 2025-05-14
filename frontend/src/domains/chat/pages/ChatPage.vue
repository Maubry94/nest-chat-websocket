<script setup lang="ts">
import { useRouteParams } from "@/composables/useRouteParams";
import { z } from "zod";
import type { Conversation } from "@/schemas/conversationSchema";
import { computed, ref } from "vue";
import type { Message } from "@/schemas/messageSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";
import TheMessage from "../components/TheMessage.vue";
import MessageBox from "../components/MessageBox.vue";

const params = useRouteParams({
	id: z.string(),
});

// Mock des conversations et messages
const conversations = ref<Conversation[]>(
	[
		{
			id: "b1e7c8a2-1f2d-4e3b-9a7c-1234567890ab",
			name: "Groupe Dev",
			messages: [
				{
					sender: "you",
					user: "Vous",
					content: "Salut l'équipe !",
					createdAt: new Date().toISOString(),
				},
				{
					sender: "them",
					user: "Alice",
					content: "Coucou !",
					createdAt: new Date().toISOString(),
				},
			],
			lastMessage: {
				sender: "them",
				user: "Alice",
				content: "Coucou !",
				createdAt: new Date().toISOString(),
			},
		},
		{
			id: "a2c9d7b3-2e4f-5c6d-8b9e-abcdef123456",
			name: "Alice",
			messages: [
				{
					sender: "you",
					user: "Vous",
					content: "Hello Alice",
					createdAt: new Date().toISOString(),
				},
				{
					sender: "them",
					user: "Alice",
					content: "Salut !",
					createdAt: new Date().toISOString(),
				},
			],
			lastMessage: {
				sender: "them",
				user: "Alice",
				content: "Salut !",
				createdAt: new Date().toISOString(),
			},
		},
		{
			id: "c3d8e9f4-3a5b-6d7e-9c0f-fedcba654321",
			name: "Bob",
			messages: [
				{
					sender: "you",
					user: "Vous",
					content: "Hey Bob",
					createdAt: new Date().toISOString(),
				},
				{
					sender: "them",
					user: "Bob",
					content: "Yo !",
					createdAt: new Date().toISOString(),
				},
			],
			lastMessage: {
				sender: "them",
				user: "Bob",
				content: "Yo !",
				createdAt: new Date().toISOString(),
			},
		},
	],
);
// End Mock

const conversation = computed(() => conversations.value.find((conv) => conv.id === params.value.id));
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

		<div class="shrink-0 pb-4">
			<MessageBox @send="sendMessage" />
		</div>
	</section>
</template>
