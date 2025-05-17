import { Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe<GenericZodSchema> implements PipeTransform {
	public constructor(private schema: ZodSchema<GenericZodSchema>) {}

	public transform(value: unknown) {
		const result = this.schema.safeParse(value);
		if (!result.success) {
			throw new Error(JSON.stringify(result.error.format()));
		}
		return result.data;
	}
}
