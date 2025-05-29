import { UserService } from "@/modules/user/services/user.service";
import { Message } from "@/providers/mongo/entities/message";
import { MongoRepository } from "@/providers/mongo/mongo.module";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { WithId } from "mongodb";

interface InputGetMessages {
	receiver: User;
	sender: User;
}

interface InputCreateMessage {
	sender: User;
	receiver: User;
	message: Message["content"];
}

@Injectable()
export class ChatService {
	public constructor(
		@Inject("MONGO_REPOSITORY")
		private readonly mongodb: MongoRepository,
		private readonly userService: UserService,
	) {}

	public async createMessage(params: InputCreateMessage) {
		return this.mongodb.messageCollection.insertOne({
			senderId: params.sender.id,
			receiverId: params.receiver.id,
			content: params.message,
			sendAt: new Date(),
			readAt: null,
		});
	}

	public async updateMessage(message: WithId<Message>): Promise<void> {
		await this.mongodb.messageCollection.updateOne(
			{
				_id: message._id,
			},
			{
				$set: {
					...message,
				},
			},
		);
	}

	public async getMessages(params: InputGetMessages) {
		const { receiver, sender } = params;

		return this.mongodb.messageCollection
			.find({
				$or: [
					{
						$and: [
							{
								senderId: sender.id,
							},
							{
								receiverId: receiver.id,
							},
						],
					},
					{
						$and: [
							{
								senderId: receiver.id,
							},
							{
								receiverId: sender.id,
							},
						],
					},
				],
			})
			.sort({
				sendAt: 1,
			})
			.toArray();
	}
}
