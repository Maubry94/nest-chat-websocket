import { ConnectedUser } from "@/modules/auth/guards/must-be-connected.guard";
import { UserRepository } from "@/modules/user/repositories/user";
import { MessageService } from "@/modules/chat/services/message.service";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
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
		const receiver = await this.userRepository.findOneById(receiverId);

		if (!receiver) {
			throw new NotFoundException("receiver.notFound");
		}

		const messages = await this.messageService.getMessages({
			receiverId: receiverId,
			connectedUserId: user.id,
		});

		console.log("Conversation retrieved:", messages);

		const formattedMessages = await Promise.all(
			messages.map(
				async({ _id, senderId, content, readAt, sendAt }) => {
					const sender = await this.userRepository.findOneById(senderId);
					const receiver = await this.userRepository.findOneById(receiverId);
					return {
						_id,
						sender: sender.username,
						receiver: receiver.username,
						content,
						readAt,
						sendAt,
					};
				},
			),
		);

		const [firstMessage] = formattedMessages;

		let conversationName = null;

		console.log(firstMessage);

		if (firstMessage) {
			conversationName = user.username === firstMessage.sender
				? firstMessage.receiver
				: firstMessage.sender;
		}

		console.log("Formatted conversation:", formattedMessages);

		return {
			conversationName,
			messages: formattedMessages,
		};
	}
}
