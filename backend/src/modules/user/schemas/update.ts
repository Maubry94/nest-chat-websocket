import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class UserUpdateDto extends createZodDto(
	z.object({
		profileColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
	}),
) {}
