import { userConversationSchema } from "@/lib/axios/types/userConversationSchema";
import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string().email(),
	profileColor: z.string(),
});

export const userWithConversationsSchema = userSchema.extend({
	conversations: userConversationSchema.array(),
});

export type User = z.infer<typeof userSchema>;
export type UserWithConversations = z.infer<typeof userWithConversationsSchema>;
