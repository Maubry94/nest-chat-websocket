import { Module, Provider } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./auth.module";
import { ChatModule } from "./chat.module";

const providers: Provider[] = [
	{
		provide: APP_PIPE,
		useClass: ZodValidationPipe,
	},

];

@Module({
	imports: [AuthModule, ChatModule],
	controllers: [],
	providers: [...providers],
})
export class AppModule {}
