import { MongoRepository } from "@/providers/mongo/mongo.module";
import { UserRepository } from "@/modules/user/repositories/user";
import { Inject, Injectable } from "@nestjs/common";

interface LastMessage {
	senderId: string;
	content: string;
}

interface Conversation {
	_id: string;
	isConnectedSender: boolean;
	lastMessage: LastMessage;
}

export interface ConversationWithSender extends Conversation {
	lastMessage: LastMessage & { senderUsername: string };
}

@Injectable()
export class ConversationService {
	public constructor(
		@Inject("MONGO_REPOSITORY")
		private readonly mongodb: MongoRepository,
		private readonly userRepository: UserRepository,
	) {}

	public async getMyConversations(userId: string) {
		const myConversations = await this.mongodb.messageCollection.aggregate<Conversation>([
			{
				$match: {
					$or: [
						{ senderId: userId },
						{ receiverId: userId },
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
					isConnectedSender: { $eq: ["$senderId", userId] },
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
							senderId: "$senderId",
							content: "$content",
						},
					},
				},
			},
			{
				$sort: {
					"lastMessage.sendAt": -1,
				},
			},
		]).toArray();
		const formattedConversations: ConversationWithSender[] = await Promise.all(
			myConversations.map(
				async(conversation) => {
					const sender = await this.userRepository.findOneById(conversation.lastMessage.senderId);
					return {
						...conversation,
						lastMessage: {
							...conversation.lastMessage,
							senderUsername: sender ? sender.username : "Unknown",
						},
					};
				},
			),
		);
		return formattedConversations;
	}
}
