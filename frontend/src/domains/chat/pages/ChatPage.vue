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
import { useGetUserById } from "@/domains/user/composables/useGetUserById";
import { useRouter } from "vue-router";
import { routerPageName } from "@/router/routerPageName";

const router = useRouter();
const { sonnerError } = useSonner();
const { HOME_PAGE } = routerPageName;

const params = useRouteParams({
	userId: z.string(),
});

const {
	user: receiver,
} = useGetUserById(
	computed(() => params.value.userId),
	() => {
		sonnerError("Utilisateur introuvable.");
		void router.push({ name: HOME_PAGE });
	},
);

const {
	conversation,
} = useGetConversationList(
	computed(() => params.value.userId),
	() => {
		sonnerError("Conversation introuvable.");
		void router.push({ name: HOME_PAGE });
	},
);

const { user } = useUserInformation();

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
			sender: {
				username: msg.sender.username,
				profileColor: msg.sender.profileColor,
			},
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
			sender: {
				username: user.value.username,
				profileColor: user.value.profileColor,
			},
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
			:chat-name="conversation.conversationName ?? receiver?.username"
		/>

		<div
			v-if="conversation"
			class="flex-1"
		>
			<ScrollArea
				v-if="conversation.messages.length > 0"
				class="h-full px-4 overflow-y-auto"
			>
				<div class="space-y-2">
					<TheMessage
						v-for="(message) in conversation.messages"
						:key="message._id"
						:message="message"
					/>
				</div>
			</ScrollArea>

			<div
				v-else
				class="h-full flex flex-col items-center justify-center flex-1 px-4"
			>
				<span class="text-lg text-muted-foreground">
					Aucun message pour le moment.
				</span>
			</div>
		</div>

		<div class="relative shrink-0 pb-4">
			<IsTyping
				v-if="receiver"
				:users="[receiver.username]"
				class="absolute -top-8 z-10"
			/>

			<MessageBox @send="sendMessage" />
		</div>
	</section>
</template>
