import { ChatController } from "@/modules/chat/chat.controller";
import { ChatGateway } from "@/modules/chat/chat.gateway";
import { MongoModule } from "@/providers/mongo/mongo.module";
import { ChatService } from "@/modules/chat/services/chat.service";
import { SessionService } from "@/modules/chat/services/session.service";
import { Module, Provider } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RedisModule } from "@/providers/redis/redis.module";
import { ConversationService } from "./services/conversation.service";
import { UserService } from "../user/services/user.service";

const providers: Provider[] = [
	ChatGateway,
	ChatService,
	SessionService,
	ConversationService,
	UserService,
];

@Module({
	imports: [MongoModule, AuthModule, RedisModule],
	controllers: [ChatController],
	providers: [...providers],
	exports: [...providers],
})
export class ChatModule {}
