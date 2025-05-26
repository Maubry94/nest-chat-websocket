import { Module, Provider } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { ConversationModule } from "./conversation/conversation.module";
import { UserModule } from "./user/user.module";

const providers: Provider[] = [
	{
		provide: APP_PIPE,
		useClass: ZodValidationPipe,
	},

];

@Module({
	imports: [
		AuthModule,
		ChatModule,
		ConversationModule,
		UserModule,
	],
	controllers: [],
	providers: [...providers],
})
export class AppModule {}
