import { z } from "zod";

export const userConversationSchema = z.object({
	_id: z.string(),
	conversationName: z.string(),
	conversationReceiverId: z.string(),
	lastMessage: z.object({
		id: z.string(),
		senderId: z.string(),
		receiverId: z.string(),
		content: z.string(),
		senderUsername: z.string(),
		isReaded: z.boolean(),
	}),
});

export type UserConversation = z.infer<typeof userConversationSchema>;
