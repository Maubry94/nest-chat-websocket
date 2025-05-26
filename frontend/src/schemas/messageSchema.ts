import { z } from "zod";

export const messageSchema = z.object({
	_id: z.string(),
	sender: z.object({
		username: z.string(),
		profileColor: z.string(),
	}),
	content: z.string(),
	sendAt: z.string(),
	readAt: z.string().nullable(),
});

export type Message = z.infer<typeof messageSchema>;
