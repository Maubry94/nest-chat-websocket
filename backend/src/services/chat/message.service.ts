import { MongoRepository } from "@/providers/mongo/mongo.module";
import { UserRepository } from "@/repositories/auth/user";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

interface InputGetConversation {
	userWantedId: User["id"];
	connectedUserId: User["id"];
}

interface InputCreateMessage {
	senderId: User["id"];
	receiverId: User["id"];
	message: string;
}

@Injectable()
export class MessageService {
	public constructor(
		@Inject("MONGO_REPOSITORY")
		private readonly mongodb: MongoRepository,
		private readonly userRepository: UserRepository,
	) {}

	public async createMessage(params: InputCreateMessage): Promise<void> {
		await this.mongodb.messageCollection.insertOne({
			senderId: params.senderId,
			receiverId: params.receiverId,
			content: params.message,
			sendAt: new Date(),
			readAt: null,
		});
	}

	public getConversation(params: InputGetConversation) {
		const { userWantedId, connectedUserId } = params;

		return this.mongodb.messageCollection
			.find({
				$or: [
					{
						$and: [
							{
								senderId: connectedUserId,
							},
							{
								receiverId: userWantedId,
							},
						],
					},
					{
						$and: [
							{
								senderId: userWantedId,
							},
							{
								receiverId: connectedUserId,
							},
						],
					},
				],
			})
			.sort({
				createdAt: -1,
			})
			.map(
				async(message) => {
					const sender = await this.userRepository.findOneById(message.senderId);
					return {
						sender: sender.username,
						content: message.content,
						sendAt: message.sendAt,
						readAt: message.readAt,
					};
				},
			)
			.toArray();
	}
}
