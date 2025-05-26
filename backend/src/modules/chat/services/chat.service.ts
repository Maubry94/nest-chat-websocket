import { Message } from "@/providers/mongo/entities/message";
import { MongoRepository } from "@/providers/mongo/mongo.module";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { WithId } from "mongodb";

interface InputGetMessages {
	receiverId: User["id"];
	connectedUserId: User["id"];
}

interface InputCreateMessage {
	senderId: User["id"];
	receiverId: User["id"];
	message: string;
}

@Injectable()
export class ChatService {
	public constructor(
		@Inject("MONGO_REPOSITORY")
		private readonly mongodb: MongoRepository,
	) {}

	public async createMessage(params: InputCreateMessage) {
		return this.mongodb.messageCollection.insertOne({
			senderId: params.senderId,
			receiverId: params.receiverId,
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

	public getMessages(params: InputGetMessages) {
		const { receiverId, connectedUserId } = params;

		return this.mongodb.messageCollection
			.find({
				$or: [
					{
						$and: [
							{
								senderId: connectedUserId,
							},
							{
								receiverId,
							},
						],
					},
					{
						$and: [
							{
								senderId: receiverId,
							},
							{
								receiverId: connectedUserId,
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
