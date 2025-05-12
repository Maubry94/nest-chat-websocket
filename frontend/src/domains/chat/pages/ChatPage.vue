<script setup lang="ts">
import { useRouteParams } from "@/composables/useRouteParams";
import { z } from "zod";
import type { Conversation } from "@/schemas/conversationSchema";
import { computed } from "vue";
import TheMessage from "../components/TheMessage.vue";
import MessageBox from "../components/MessageBox.vue";

const params = useRouteParams({
	id: z.string(),
});

// Mock des conversations et messages
const conversations: Conversation[] = [
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
];
// End Mock

const conversation = computed(() => conversations.find((conv) => conv.id === params.value.id));
const messages = computed(() => conversation.value?.messages ?? []);
const chatName = computed(() => conversation.value?.name ?? "");
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
