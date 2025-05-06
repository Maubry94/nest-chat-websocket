import { z } from "zod";

export const messageSchema = z.object({
	sender: z.enum(["you", "them"]),
	user: z.string(),
	content: z.string(),
	createdAt: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
