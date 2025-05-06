<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBox from "../components/MessageBox.vue";
import TheMessage from "../components/TheMessage.vue";
import type { Message } from "@/schemas/messageSchema";

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
		user: isYou ? "Vous" : `Utilisateur ${Math.floor(messageNumber / MESS_CONF.MESSAGE_USER_DIVISOR) + MESS_CONF.USER_INDEX_OFFSET}`,
		content: `Message ${messageNumber}`,
		createdAt: new Date(
			Date.now() - ((MESS_CONF.TOTAL_MESSAGES - messageNumber) * MESS_CONF.MILLIS_IN_MINUTE),
		).toISOString(),
	};
});
// End of mock data
</script>

<template>
  <section class="h-full flex flex-col gap-4">
    <ScrollArea class="h-[calc(100vh-4rem-2*2rem)]">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">
          Conversation
        </h4>

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
      </div>
    </ScrollArea>

    <MessageBox />
  </section>
</template>
