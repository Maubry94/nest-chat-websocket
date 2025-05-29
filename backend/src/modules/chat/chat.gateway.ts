import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { z } from "zod";
import { SessionService } from "@/modules/chat/services/session.service";
import { TokenService } from "@/modules/auth/services/token";
import { ChatService } from "@/modules/chat/services/chat.service";
import { UserService } from "../user/services/user.service";
import { User } from "@prisma/client";

const chatMessageSchema = z.object({
	receiverId: z.string(),
	message: z.string(),
});

const checkReadAtSchema = z.object({
	receiverId: z.string(),
});

const checkIsTypingSchema = z.object({
	receiverId: z.string(),
	isTyping: z.boolean(),
});

declare module "socket.io" {
	interface Socket {
		user: User;
	}
}

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	public constructor(
		private readonly sessionService: SessionService,
		private readonly tokenService: TokenService,
		private readonly userService: UserService,
		private readonly messageService: ChatService,
	) {}

	private static readonly ZERO = 0;

	@WebSocketServer()
	private server!: Server;

	public async handleDisconnect(@ConnectedSocket() socket: Socket) {
		await this.sessionService.removeSessionBySocket(socket.id);
	}

	public async handleConnection(@ConnectedSocket() socket: Socket) {
		const extractedToken = socket.handshake.auth?.token as string;

		if (!extractedToken) {
			socket.disconnect();
			throw new Error("authorization.missing");
		}

		const verifiedToken = this.tokenService.checkToken(extractedToken);

		if (!verifiedToken) {
			socket.disconnect();
			throw new Error("accessToken.invalid");
		}

		const { userId } = verifiedToken;

		try {
			const user = await this.userService.getUserById(userId);

			socket.user = user;
			await this.sessionService.createSession(user, socket.id);
		} catch (error) {
			socket.disconnect();
			throw error;
		}
	}

	@SubscribeMessage("check-readAt")
	public async handleCheckReadAt(
		@MessageBody(new ZodValidationPipe(checkReadAtSchema)) data: z.infer<typeof checkReadAtSchema>,
		@ConnectedSocket() socket: Socket,
	) {
		const { receiverId } = data;

		const receiver = await this.userService.getUserById(receiverId);

		const sockets = await this.sessionService.getSocketsIdsByUser(receiver.id);

		if (sockets.length === ChatGateway.ZERO) {
			return;
		}

		const unreadReceiverMessages = await this.messageService.getMessages({
			receiver,
			sender: socket.user,
		}).then(
			(messages) => messages.filter(
				({ senderId, readAt }) => senderId === receiverId && readAt === null,
			),
		);

		for (const message of unreadReceiverMessages) {
			const now = new Date();

			await this.messageService.updateMessage({
				...message,
				readAt: now,
			});

			sockets.forEach(
				(socketId) => {
					this.server.to(socketId).emit("messages-readed", {
						messageId: message._id,
						readAt: now.toISOString(),
					});
				},
			);
		}

		return {
			readAtChecked: unreadReceiverMessages.length > ChatGateway.ZERO,
		};
	}

	@SubscribeMessage("send-isTyping")
	public async handleCheckIsTyping(
		@MessageBody(new ZodValidationPipe(checkIsTypingSchema)) data: z.infer<typeof checkIsTypingSchema>,
	) {
		const { receiverId, isTyping } = data;

		const receiver = await this.userService.getUserById(receiverId);

		const sockets = await this.sessionService.getSocketsIdsByUser(receiver.id);

		sockets.forEach(
			(socketId) => {
				this.server.to(socketId).emit("is-typing", isTyping);
			},
		);
	}

	@SubscribeMessage("send-message")
	public async handleMessage(
		@MessageBody(new ZodValidationPipe(chatMessageSchema)) data: z.infer<typeof chatMessageSchema>,
		@ConnectedSocket() socket: Socket,
	) {
		const { receiverId, message } = data;

		const receiver = await this.userService.getUserById(receiverId);

		const socketIds = await this.sessionService.getSocketsIdsByUser(receiver.id);

		const createdMessage = await this.messageService.createMessage({
			sender: socket.user,
			receiver,
			message,
		});

		socketIds.forEach(
			(socketId) => {
				this.server.to(socketId).emit(
					"receive-message",
					{
						_id: createdMessage.insertedId,
						sender: socket.user,
						message,
						sendAt: new Date().toISOString(),
					},
				);
			},
		);

		return createdMessage.insertedId;
	}
}
