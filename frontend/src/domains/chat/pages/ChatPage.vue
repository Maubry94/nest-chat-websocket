<script setup lang="ts">
import { useRouteParams } from "@/composables/useRouteParams";
import { z } from "zod";
import { computed, onMounted, ref, watch, onUnmounted, nextTick } from "vue";
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
import { useChatSounds } from "../composables/useChatSounds";
import { scrollToBottom } from "@/lib/utils";
import type { User } from "@/schemas/userSchema";

const router = useRouter();
const { sonnerError } = useSonner();
const { HOME_PAGE } = routerPageName;
const { playSendSound, playReceiveSound } = useChatSounds();
const { user, fetchInformation } = useUserInformation();
const isTyping = ref(false);
const scrollAreaRef = ref<InstanceType<typeof ScrollArea> | null>(null);
const isTypingSender = ref<User | null>(null);

interface ReceivedMessage {
	_id: string;
	sender: {
		id: string;
		username: string;
		profileColor: string;
	};
	message: string;
	sendAt: string;
	readAt?: string | null;
}

const params = useRouteParams({
	receiverId: z.string(),
});

const {
	user: receiver,
} = useGetUserById(
	computed(() => params.value.receiverId),
	() => {
		sonnerError("Utilisateur introuvable.");
		void router.push({ name: HOME_PAGE });
	},
);

const {
	conversation,
} = useGetConversationList(
	computed(() => params.value.receiverId),
	() => {
		sonnerError("Conversation introuvable.");
		void router.push({ name: HOME_PAGE });
	},
);

chatSocket.on(
	"is-typing",
	(response: {
		isTyping: boolean;
		sender: User;
	}) => {
		isTyping.value = response.isTyping;
		isTypingSender.value = response.sender;
	},
);

chatSocket.on(
	"messages-readed",
	(response: {
		messageId: string;
		readAt: string;
	}) => {
		if (!conversation.value) {
			return;
		}

		const message = conversation.value.messages.find(
			(message) => message._id === response.messageId,
		);

		if (message) {
			message.readAt = response.readAt;
		}

		void fetchInformation();
	},
);

async function sendMessage(content: string) {
	if (!user.value || !receiver.value) {
		sonnerError("Vous devez être connecté pour envoyer un message.");
		return;
	}

	if (!content.trim()) {
		return;
	}

	try {
		const serverMessageId: string = await chatSocket
			.timeout(chatSocketConfig.timeout)
			.emitWithAck(
				"send-message",
				{
					receiverId: params.value.receiverId,
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

		void fetchInformation();

		playSendSound();
	} catch {
		sonnerError("Échec d'envoi du message.");
	}
}

function handleIsTyping(value: boolean) {
	chatSocket.emit(
		"send-isTyping",
		{
			receiverId: params.value.receiverId,
			isTyping: value,
		},
	);
}

async function emitCheckReatAt() {
	try {
		const response: { readAtChecked: boolean } = await chatSocket
			.timeout(chatSocketConfig.timeout)
			.emitWithAck(
				"check-readAt",
				{
					receiverId: params.value.receiverId,
				},
			);

		if (response.readAtChecked) {
			const currentUserConversation = user.value?.conversations.find(
				(conv) => conv.conversationReceiverId === params.value.receiverId,
			);

			if (currentUserConversation) {
				currentUserConversation.lastMessage.isReaded = true;
			}
		}
	} catch {
		// Error intentionally ignored
	}
}

function handleReceiveMessage(message: ReceivedMessage) {
	if (!conversation.value || !user.value || !receiver.value) {
		return;
	}

	if (message.sender.id === params.value.receiverId) {
		conversation.value.messages.push({
			_id: message._id,
			sender: {
				username: message.sender.username,
				profileColor: message.sender.profileColor,
			},
			content: message.message,
			sendAt: message.sendAt,
			readAt: message.readAt ?? null,
		});
	}

	void fetchInformation();

	playReceiveSound();
}

onMounted(
	() => {
		chatSocket.on("receive-message", handleReceiveMessage);
	},
);

onUnmounted(() => {
	chatSocket.off("receive-message", handleReceiveMessage);
});

watch(
	() => ({
		messages: conversation.value?.messages,
		element: scrollAreaRef.value,
	}),
	async({ messages, element }) => {
		if (!messages || !element) {
			return;
		}

		// Ensure the scroll area is ready before scrolling
		await nextTick();
		const viewport = element.$el?.querySelector("[data-reka-scroll-area-viewport]");

		scrollToBottom(viewport, () => emitCheckReatAt());
	},
	{
		immediate: true,
		deep: true,
	},
);
</script>

<template>
	<section class="h-full flex flex-col bg-background">
		<ChatHeader
			v-if="conversation"
			:chat-name="conversation.conversationName"
		/>

		<ScrollArea
			ref="scrollAreaRef"
			v-if="conversation"
			:class="[
				'flex-1 px-4 overflow-y-auto',
				{ 'no-messages': conversation.messages.length === 0 }
			]"
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
				class="flex flex-col items-center justify-center gap-2"
			>
				<p class="text-lg text-text-secondary">
					Aucun message pour le moment.
				</p>
			</div>
		</ScrollArea>

		<div class="relative shrink-0 pb-4">
			<IsTyping
				v-if="isTypingSender && isTyping && isTypingSender.id === params.receiverId"
				:users="[isTypingSender.username]"
				class="absolute -top-8 z-10"
			/>

			<MessageBox
				@send="sendMessage"
				@is-typing="handleIsTyping"
			/>
		</div>
	</section>
</template>

<style scoped>
:deep(.no-messages [data-reka-scroll-area-viewport]) {
  min-height: 100%;
  display: flex;
}

:deep(.no-messages [data-reka-scroll-area-viewport] > div) {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
