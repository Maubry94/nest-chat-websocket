import { MessageController } from "@/controllers/message.controller";
import { ChatGateway } from "@/gateway/chat.gateway";
import { MongoModule } from "@/providers/mongo/mongo.module";
import { MessageService } from "@/services/chat/message.service";
import { SessionService } from "@/services/chat/session.service";
import { Module, Provider } from "@nestjs/common";
import { AuthModule } from "./auth.module";
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
