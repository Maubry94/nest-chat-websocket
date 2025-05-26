import { z } from "zod";

export const myConversationSchema = z.object({
	_id: z.string(),
	isConnectedSender: z.boolean(),
	conversationName: z.string(),
	conversationReceiverId: z.string(),
	lastMessage: z.object({
		senderId: z.string(),
		receiverId: z.string(),
		content: z.string(),
		senderUsername: z.string(),
	}),
});

export type MyConversation = z.infer<typeof myConversationSchema>;
