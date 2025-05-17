import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class SessionService {
	public constructor(
		@Inject("REDIS_CLIENT")
		private readonly redis: Redis,
	) {}

	private getUserSessionsKey(userId: string) {
		return `user_sessions:${userId}`;
	}

	private getSocketUserKey(socketId: string) {
		return `socket_user:${socketId}`;
	}

	public async createSession(userId: string, socketId: string): Promise<void> {
		await this.redis.sadd(this.getUserSessionsKey(userId), socketId);
		await this.redis.set(this.getSocketUserKey(socketId), userId);
	}

	public async removeSessionBySocket(socketId: string): Promise<void> {
		const userId = await this.redis.get(this.getSocketUserKey(socketId));
		if (userId) {
			await this.redis.srem(this.getUserSessionsKey(userId), socketId);
			await this.redis.del(this.getSocketUserKey(socketId));
		}
	}

	public async getSocketsByUser(userId: string): Promise<string[]> {
		return this.redis.smembers(this.getUserSessionsKey(userId));
	}

	public async getUserBySocket(socketId: string): Promise<string | null> {
		return this.redis.get(this.getSocketUserKey(socketId));
	}
}
