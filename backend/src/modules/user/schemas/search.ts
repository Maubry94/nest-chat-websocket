import { z } from "zod";

const MIN_USERNAME_LENGTH = 1;

export const userSearchSchema = z.object({
	username: z.string().min(MIN_USERNAME_LENGTH),
});

export type UserSearchDto = z.infer<typeof userSearchSchema>;
