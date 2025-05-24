<script setup lang="ts">
import { useRouteParams } from "@/composables/useRouteParams";
import { z } from "zod";
import { computed, onMounted } from "vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "@/domains/chat/components/ChatHeader.vue";
import TheMessage from "../components/TheMessage.vue";
import IsTyping from "../components/IsTyping.vue";
import MessageBox from "../components/MessageBox.vue";
import { useUserInformation } from "@/domains/user/composables/useUserInformation";
import { useSonner } from "@/composables/useSonner";
import { useGetConversationList } from "../composables/useGetConversationList";
import { chatSocket, chatSocketConfig } from "@/lib/socket";

const params = useRouteParams({
	userId: z.string(),
});

const {
	conversation,
} = useGetConversationList(
	computed(() => params.value.userId),
);

const { user } = useUserInformation();

const { sonnerError } = useSonner();

onMounted(() => {
	chatSocket.emit("check-readAt", {
		receiverId: params.value.userId,
	});

	chatSocket.on("receive-message", (msg) => {
		if (!conversation.value) {
			return;
		}
		conversation.value.messages.push({
			_id: msg._id,
			sender: msg.sender,
			content: msg.message,
			sendAt: msg.sendAt,
			readAt: msg.readAt ?? null,
		});
	});
});

chatSocket.on(
	"messages-readed",
	(response) => {
		if (!conversation.value) {
			return;
		}

		const message = conversation.value.messages.find(
			(msg) => msg._id === response.messageId,
		);

		if (message) {
			message.readAt = response.readAt;
		}
	},
);

async function sendMessage(content: string) {
	if (!user.value) {
		sonnerError("Vous devez être connecté pour envoyer un message.");
		return;
	}

	if (!content.trim()) {
		return;
	}

	try {
		const serverMessageId = await chatSocket
			.timeout(chatSocketConfig.timeout)
			.emitWithAck(
				"send-message",
				{
					receiverId: params.value.userId,
					message: content,
				},
			);

		conversation.value?.messages.push({
			_id: serverMessageId,
			sender: user.value.username,
			content,
			sendAt: new Date().toISOString(),
			readAt: null,
		});
	} catch {
		sonnerError("Échec d'envoi du message.");
	}
}
</script>

<template>
	<section class="h-full flex flex-col bg-background">
		<ChatHeader
			v-if="conversation"
			:chat-name="conversation.conversationName"
		/>

		<ScrollArea
			v-if="conversation"
			class="flex-1 px-4 overflow-y-auto"
		>
			<div
				v-if="conversation.messages.length > 0"
				class="space-y-2"
			>
				<TheMessage
					v-for="(message, index) in conversation.messages"
					:key="index"
					:message="message"
				/>
			</div>

			<div
				v-else
				class="flex flex-col items-center justify-center flex-1 px-4"
			>
				<div class="flex flex-col items-center justify-center gap-2">
					<p class="text-lg text-text-secondary">
						Aucun message pour le moment.
					</p>
				</div>
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
