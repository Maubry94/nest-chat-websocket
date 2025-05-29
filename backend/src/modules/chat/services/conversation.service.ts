import { MongoRepository } from "@/providers/mongo/mongo.module";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Message } from "@/providers/mongo/entities/message";

type LastMessage = Message & { id: string };

interface Conversation {
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
	) {}

	public getConversations(connectedUser: User) {
		return this.mongodb.messageCollection.aggregate<Conversation>(
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
	}
}
