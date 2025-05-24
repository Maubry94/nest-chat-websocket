import { MongoModule } from "@/providers/mongo/mongo.module";
import { Module, Provider } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { ConversationController } from "@/controllers/conversation.controller";
import { ConversationService } from "@/services/conversation/conversation.service";

const providers: Provider[] = [ConversationService];

@Module({
	imports: [MongoModule, AuthModule],
	controllers: [ConversationController],
	providers: [...providers],
})
export class ConversationModule {}
