import { ConnectedUser } from "@/guards/must-be-connected.guard";
import { MessageService } from "@/services/chat/message.service";
import { Controller, Get, Param } from "@nestjs/common";
import { User } from "@prisma/client";

@Controller()
export class MessageController {
	public constructor(
		private readonly messageService: MessageService,
	) {
	}

	public static readonly GET_MESSAGES_BY_USER_ID = "/messages/:receiverId";

	@Get(MessageController.GET_MESSAGES_BY_USER_ID)
	public async getMessagesByUserId(
		@Param("receiverId") receiverId: string,
		@ConnectedUser() user: User,
	) {
		return this.messageService.getConversation({
			userWantedId: receiverId,
			connectedUserId: user.id,
		});
	}
}
