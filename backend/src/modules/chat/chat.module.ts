import { MessageController } from "@/modules/chat/message.controller";
import { ChatGateway } from "@/modules/chat/chat.gateway";
import { MongoModule } from "@/providers/mongo/mongo.module";
import { MessageService } from "@/modules/chat/services/message.service";
import { SessionService } from "@/modules/chat/services/session.service";
import { Module, Provider } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RedisModule } from "@/providers/redis/redis.module";

const providers: Provider[] = [
	ChatGateway,
	MessageService,
	SessionService,
];

@Module({
	imports: [MongoModule, AuthModule, RedisModule],
	controllers: [MessageController],
	providers: [...providers],
})
export class ChatModule {}
