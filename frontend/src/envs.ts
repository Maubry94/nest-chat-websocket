import { z } from "zod";

export const envs = z
	.object({
		VITE_API_BASE_URL: z.string().url(),
	})
	.readonly()
	.parse(import.meta.env as unknown);
