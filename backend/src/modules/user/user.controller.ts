import { ConnectedUser } from "@/modules/auth/guards/must-be-connected.guard";
import { UserSearchDto, userSearchSchema } from "@/modules/user/schemas/search";
import { UserUpdateDto } from "@/modules/user/schemas/update";
import { UserService } from "@/modules/user/services/user.service";
import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { User } from "@prisma/client";
import { ZodValidationPipe } from "nestjs-zod";
import { ConversationService } from "../chat/services/conversation.service";

@Controller()
export class UserController {
	public constructor(
		private readonly userService: UserService,
		private readonly conversationService: ConversationService,
	) {}

	public static readonly SEARCH_BY_USERNAME = "/users";

	public static readonly UPDATE_USER = "/update-user";

	public static readonly GET_USER = "/user";

	public static readonly GET_USER_BY_ID = "/users/:id";

	@Get(UserController.SEARCH_BY_USERNAME)
	public async searchByUsername(@Query(new ZodValidationPipe(userSearchSchema)) search: UserSearchDto) {
		return this.userService.searchByUsername(search.username);
	}

	@Get(UserController.GET_USER)
	public async getUser(@ConnectedUser() user: User) {
		const conversationFromMessages = await this.conversationService.getConversations(user);

		const conversationFromMessagesFormatted = await Promise.all(
			conversationFromMessages.map(
				async(conversation) => {
					const sender = await this.userService.getUserById(conversation.lastMessage.senderId);
					const receiver = await this.userService.getUserById(conversation.lastMessage.receiverId);

					return {
						...conversation,
						conversationName: sender.id === user.id ? receiver.username : sender.username,
						conversationReceiverId: sender.id === user.id ? receiver.id : sender.id,
						lastMessage: {
							...conversation.lastMessage,
							senderUsername: sender.id === user.id ? "(Vous)" : sender.username,
							isReaded: !!conversation.lastMessage.readAt,
						},
					};
				},
			),
		);
		return {
			...user,
			conversations: conversationFromMessagesFormatted,
		};
	}

	@Get(UserController.GET_USER_BY_ID)
	public async getUserById(@Param("id") id: string) {
		return this.userService.getUserById(id);
	}

	@Patch(UserController.UPDATE_USER)
	public async updateUserProfileColor(@ConnectedUser() user: User, @Body() body: UserUpdateDto) {
		return this.userService.updateUserProfileColor({
			userId: user.id,
			profileColor: body.profileColor,
		});
	}
}
