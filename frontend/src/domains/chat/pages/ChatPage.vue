<script setup lang="ts">
import { useRouteParams } from "@/composables/useRouteParams";
import { z } from "zod";
import { computed, onMounted } from "vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";
import TheMessage from "../components/TheMessage.vue";
import IsTyping from "../components/IsTyping.vue";
import MessageBox from "../components/MessageBox.vue";
import { chatSocket } from "@/lib/socket";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { useSonner } from "@/composables/useSonner";
import { useGetConversation } from "../composables/useGetConversation";

const params = useRouteParams({
	userId: z.string(),
});

const {
	conversation,
} = useGetConversation(
	computed(() => params.value.userId),
);

const { user } = useUserInformation();

const { sonnerError } = useSonner();

onMounted(() => {
	chatSocket.on("receive-message", (msg) => {
		conversation.value.push({
			sender: msg.sender,
			content: msg.message,
			sendAt: msg.sendAt,
			readAt: msg.readAt ?? null,
		});
	});
});

function sendMessage(content: string) {
	if (!user.value) {
		sonnerError("Vous devez être connecté pour envoyer un message.");
		return;
	}

	if (!content.trim()) {
		return;
	}

	chatSocket.emit(
		"send-message",
		{
			receiverId: params.value.userId,
			message: content,
		},
	);

	//TODO: voir comment faire pour ne pas push le message si l'envoi échoue
	conversation.value.push({
		sender: user.value.username,
		content,
		sendAt: new Date().toISOString(),
		readAt: null,
	});
}
</script>

<template>
	<section class="h-full flex flex-col bg-background">
		<ChatHeader />

		<ScrollArea class="flex-1 px-4 overflow-y-auto">
			<div class="space-y-2">
				<TheMessage
					v-for="(message, index) in conversation"
					:key="index"
					:sender="message.sender"
					:content="message.content"
					:send-at="message.sendAt"
					:read-at="message.readAt"
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
