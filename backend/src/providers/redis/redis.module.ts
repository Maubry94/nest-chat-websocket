import envs from "@/envs";
import { Module, Global } from "@nestjs/common";
import Redis from "ioredis";

@Global()
@Module({
	providers: [
		{
			provide: "REDIS_CLIENT",
			useFactory: () => new Redis({
				host: envs.REDIS_HOST,
				port: envs.REDIS_PORT,
			}),
		},
	],
	exports: ["REDIS_CLIENT"],
})
export class RedisModule {}
