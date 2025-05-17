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
import { ZodValidationPipe } from "./zod-validation.pipe";
import { z } from "zod";
import { SessionService } from "@/services/chat/session.service";
import { TokenService } from "@/services/auth/token";
import { UserRepository } from "@/repositories/auth/user";
import { MessageService } from "@/services/chat/message.service";

const chatMessageSchema = z.object({
	receiverId: z.string(),
	message: z.string(),
});

declare module "socket.io" {
	interface Socket {
		senderId: string;
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
		private readonly messageService: MessageService,
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

		socket.senderId = userId;

		await this.sessionService.createSession(userId, socket.id);
	}

	@SubscribeMessage("send-message")
	public async handleMessage(
		@MessageBody(new ZodValidationPipe(chatMessageSchema)) data: z.infer<typeof chatMessageSchema>,
		@ConnectedSocket() socket: Socket,
	) {
		if (!data) {
			socket.disconnect();
			throw new Error("Invalid data");
		}

		const { receiverId, message } = data;
		const senderId = socket.senderId;

		const receiver = await this.userRepository.findOneById(receiverId);

		if (!receiver) {
			socket.disconnect();
			throw new Error("Receiver not found");
		}

		const sockets = await this.sessionService.getSocketsByUser(receiverId);

		if (sockets.length === ChatGateway.NO_SOCKETS) {
			socket.disconnect();
			throw new Error("No sockets found for user");
		}

		const sender = await this.userRepository.findOneById(senderId);

		sockets.forEach(
			(socketId) => {
				this.server.to(socketId).emit("receive-message", {
					sender: sender.username,
					message: message,
					sendAt: new Date().toISOString(),
				});
			},
		);

		await this.messageService.createMessage({
			senderId: senderId,
			receiverId: receiverId,
			message: message,
		});
	}
}
