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
import { UserRepository } from "@/modules/user/repositories/user";
import { ChatService } from "@/modules/chat/services/chat.service";

const chatMessageSchema = z.object({
	receiverId: z.string(),
	message: z.string(),
});

const checkReadAtSchema = z.object({
	receiverId: z.string(),
});

declare module "socket.io" {
	interface Socket {
		connectedUserId: string;
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
		private readonly userRepository: UserRepository,
		private readonly messageService: ChatService,
	) {}

	private static readonly NO_SOCKETS = 0;

	@WebSocketServer()
	private server: Server;

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

		const user = await this.userRepository.findOneById(userId);

		if (!user) {
			socket.disconnect();
			throw new Error("user.notfound");
		}

		socket.connectedUserId = userId;

		await this.sessionService.createSession(userId, socket.id);
	}

	@SubscribeMessage("check-readAt")
	public async handleCheckReadAt(
		@MessageBody(new ZodValidationPipe(checkReadAtSchema)) data: z.infer<typeof checkReadAtSchema>,
		@ConnectedSocket() socket: Socket,
	) {
		const { receiverId } = data;

		const receiver = await this.userRepository.findOneById(receiverId);

		if (!receiver) {
			console.error("Receiver not found");
			return;
		}

		const sockets = await this.sessionService.getSocketsIdsByUser(receiverId);

		if (sockets.length === ChatGateway.NO_SOCKETS) {
			return;
		}

		const unreadReceiverMessages = await this.messageService.getMessages({
			receiverId,
			connectedUserId: socket.connectedUserId,
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
	}

	@SubscribeMessage("send-message")
	public async handleMessage(
		@MessageBody(new ZodValidationPipe(chatMessageSchema)) data: z.infer<typeof chatMessageSchema>,
		@ConnectedSocket() socket: Socket,
	) {
		const { receiverId, message } = data;
		const senderId = socket.connectedUserId;

		const receiver = await this.userRepository.findOneById(receiverId);

		if (!receiver) {
			console.error("Receiver not found");
			return;
		}

		const sockets = await this.sessionService.getSocketsIdsByUser(receiverId);
		const sender = await this.userRepository.findOneById(senderId);

		if (!sender) {
			console.error("Receiver not found");
			return;
		}

		const createdMessage = await this.messageService.createMessage({
			senderId,
			receiverId,
			message,
		});

		if (sockets.length > ChatGateway.NO_SOCKETS) {
			sockets.forEach((socketId) => {
				this.server.to(socketId).emit("receive-message", {
					_id: createdMessage.insertedId,
					sender: {
						username: sender.username,
						profileColor: sender.profileColor,
					},
					message,
					sendAt: new Date().toISOString(),
				});
			});
		}

		return createdMessage.insertedId;
	}
}
