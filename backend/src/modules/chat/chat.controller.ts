import { ConnectedUser } from "@/modules/auth/guards/must-be-connected.guard";
import { UserRepository } from "@/modules/user/repositories/user";
import { ChatService } from "@/modules/chat/services/chat.service";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { User } from "@prisma/client";

@Controller()
export class ChatController {
	public constructor(
		private readonly messageService: ChatService,
		private readonly userRepository: UserRepository,
	) {
	}

	public static readonly GET_CHAT_BY_USER_ID = "/messages/:receiverId";

	@Get(ChatController.GET_CHAT_BY_USER_ID)
	public async getChatByUserId(
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

		const formattedMessages = await Promise.all(
			messages.map(
				async(
					{
						_id,
						senderId: messageSenderId,
						receiverId: messageReceiverId,
						content,
						readAt,
						sendAt,
					},
				) => {
					const [sender, receiver] = await Promise.all(
						[
							this.userRepository.findOneById(messageSenderId),
							this.userRepository.findOneById(messageReceiverId),
						],
					);

					if (!sender || !receiver) {
						throw new NotFoundException("user.notFound");
					}

					return {
						_id,
						sender: {
							username: sender.username,
							profileColor: sender.profileColor,
						},
						receiver: receiver.username,
						content,
						readAt,
						sendAt,
					};
				},
			),
		);

		return {
			conversationName: receiver.username,
			messages: formattedMessages,
		};
	}
}
