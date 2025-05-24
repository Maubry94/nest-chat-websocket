import { myConversationSchema } from "@/lib/axios/types/myConversationsSchema";
import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string().email(),
	myConversations: z.array(myConversationSchema),
});

export type User = z.infer<typeof userSchema>;
