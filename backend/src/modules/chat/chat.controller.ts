import { ConnectedUser } from "@/modules/auth/guards/must-be-connected.guard";
import { ChatService } from "@/modules/chat/services/chat.service";
import { Controller, Get, Param } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "../user/services/user.service";

@Controller()
export class ChatController {
	public constructor(
		private readonly messageService: ChatService,
		private readonly userService: UserService,
	) {
	}

	public static readonly GET_CHAT_BY_USER_ID = "/messages/:receiverId";

	@Get(ChatController.GET_CHAT_BY_USER_ID)
	public async getChatByUserId(
		@Param("receiverId") receiverId: string,
		@ConnectedUser() connectedUser: User,
	) {
		const receiver = await this.userService.getUserById(receiverId);

		const messages = await this.messageService.getMessages({
			receiver,
			sender: connectedUser,
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
							this.userService.getUserById(messageSenderId),
							this.userService.getUserById(messageReceiverId),
						],
					);

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
