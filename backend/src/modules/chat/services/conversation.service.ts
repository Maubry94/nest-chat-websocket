import { MongoRepository } from "@/providers/mongo/mongo.module";
import { UserRepository } from "@/modules/user/repositories/user";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";

interface LastMessage {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	sendAt: Date;
	readAt: Date | null;
}

interface UserConversation {
	_id: string;
	conversationName: string;
	conversationReceiverId: string;
	isConnectedSender: boolean;
	lastMessage: LastMessage;
}

@Injectable()
export class ConversationService {
	public constructor(
		@Inject("MONGO_REPOSITORY")
		private readonly mongodb: MongoRepository,
		private readonly userRepository: UserRepository,
	) {}

	public async getUserConversations(connectedUser: User) {
		const userConversations = await this.mongodb.messageCollection.aggregate<UserConversation>(
			[
				{
					$match: {
						$or: [
							{ senderId: connectedUser.id },
							{ receiverId: connectedUser.id },
						],
					},
				},
				{
					$addFields: {
						conversationKey: {
							$cond: {
								if: { $lt: ["$senderId", "$receiverId"] },
								then: { $concat: ["$senderId", "_", "$receiverId"] },
								else: { $concat: ["$receiverId", "_", "$senderId"] },
							},
						},
						isConnectedSender: { $eq: ["$senderId", connectedUser.id] },
					},
				},
				{
					$sort: { sendAt: -1 },
				},
				{
					$group: {
						_id: "$conversationKey",
						isConnectedSender: { $first: "$isConnectedSender" },
						lastMessage: {
							$first: {
								id: "$_id",
								senderId: "$senderId",
								receiverId: "$receiverId",
								content: "$content",
								sendAt: "$sendAt",
								readAt: "$readAt",
							},
						},
					},
				},
				{
					$sort: {
						"lastMessage.sendAt": -1,
					},
				},
			],
		).toArray();

		const formattedUserConversations = await Promise.all(
			userConversations.map(
				async(conversation) => {
					const sender = await this.userRepository.findOneById(conversation.lastMessage.senderId);
					const receiver = await this.userRepository.findOneById(conversation.lastMessage.receiverId);

					if (!sender || !receiver) {
						throw new NotFoundException("Receiver or Sender not found in conversation");
					}

					return {
						...conversation,
						conversationName: sender.id === connectedUser.id ? receiver.username : sender.username,
						conversationReceiverId: sender.id === connectedUser.id ? receiver.id : sender.id,
						lastMessage: {
							...conversation.lastMessage,
							senderUsername: sender.id === connectedUser.id ? "(Vous)" : sender.username,
							isReaded: !!conversation.lastMessage.readAt,
						},
					};
				},
			),
		);

		return formattedUserConversations;
	}
}
