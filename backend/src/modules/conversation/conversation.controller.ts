import { ConnectedUser } from "@/modules/auth/guards/must-be-connected.guard";
import { ConversationService, ConversationWithSender } from "@/modules/conversation/services/conversation.service";
import { Controller, Get } from "@nestjs/common";
import { User } from "@prisma/client";

@Controller()
export class ConversationController {
	public constructor(
		private readonly conversationService: ConversationService,
	) {}

	public static readonly GET_MY_CONVERSATIONS = "/get-my-conversations";

	@Get(ConversationController.GET_MY_CONVERSATIONS)
	public getMyConversation(@ConnectedUser() user: User): Promise<ConversationWithSender[]> {
		return this.conversationService.getMyConversations(user.id);
	}
}
