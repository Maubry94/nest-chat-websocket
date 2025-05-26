import { MongoModule } from "@/providers/mongo/mongo.module";
import { Module, Provider } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ConversationController } from "@/modules/conversation/conversation.controller";
import { ConversationService } from "@/modules/conversation/services/conversation.service";

const providers: Provider[] = [ConversationService];

@Module({
	imports: [MongoModule, AuthModule],
	controllers: [ConversationController],
	providers: [...providers],
})
export class ConversationModule {}
