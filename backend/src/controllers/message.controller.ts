import { ConnectedUser } from "@/guards/must-be-connected.guard";
import { UserRepository } from "@/repositories/auth/user";
import { MessageService } from "@/services/chat/message.service";
import { Controller, Get, Param } from "@nestjs/common";
import { User } from "@prisma/client";

@Controller()
export class MessageController {
	public constructor(
		private readonly messageService: MessageService,
		private readonly userRepository: UserRepository,
	) {
	}

	public static readonly GET_MESSAGES_BY_USER_ID = "/messages/:receiverId";

	@Get(MessageController.GET_MESSAGES_BY_USER_ID)
	public async getMessagesByUserId(
		@Param("receiverId") receiverId: string,
		@ConnectedUser() user: User,
	) {
		const conversation = await this.messageService.getMessages({
			receiverId: receiverId,
			connectedUserId: user.id,
		});

		const formattedConversation = await Promise.all(
			conversation.map(async({ _id, senderId, content, readAt, sendAt }) => {
				const sender = await this.userRepository.findOneById(senderId);
				return {
					_id,
					sender: sender.username,
					content,
					readAt,
					sendAt,
				};
			}),
		);

		const conversationName = formattedConversation.find(
			({ sender }) => sender !== user.username,
		)?.sender;

		return {
			conversationName,
			messages: formattedConversation,
		};
	}
}
