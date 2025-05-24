import { messageSchema } from "@/schemas/messageSchema";
import { z } from "zod";

export const conversationListSchema = z.object({
	conversationName: z.string(),
	messages: z.array(messageSchema),
});

export type ConversationList = z.infer<typeof conversationListSchema>;

