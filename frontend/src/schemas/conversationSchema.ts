import { z } from "zod";
import { messageSchema } from "./messageSchema";

export const conversationSchema = z.object({
	id: z.string(),
	name: z.string(),
	messages: z.array(messageSchema),
	lastMessage: messageSchema,
});

export type Conversation = z.infer<typeof conversationSchema>;
