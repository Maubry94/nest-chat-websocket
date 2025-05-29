import { MiddlewareConsumer, Module, NestModule, RequestMethod, type Provider } from "@nestjs/common";
import { PrismaModule } from "@/providers/prisma/prisma.module";
import { FirebaseModule } from "@/providers/firebase/firebase.module";
import { UserRepository } from "@/modules/user/repositories/user";
import { TokenService } from "@/modules/auth/services/token";
import { FindOrCreateUserUsecase } from "@/modules/user/services/usecases/findOrCreateUser";
import { AuthController } from "@/modules/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import envs from "@/envs";
import { MustBeConnected } from "@/modules/auth/guards/must-be-connected.guard";
import { RouteInfo } from "@nestjs/common/interfaces";
import { ChatController } from "@/modules/chat/chat.controller";
import { UserController } from "@/modules/user/user.controller";

const providers: Provider[] = [
	FindOrCreateUserUsecase,
	UserRepository,
	TokenService,
];

const mustBeConnectedRoutes: RouteInfo[] = [
	{
		path: UserController.GET_USER,
		method: RequestMethod.GET,
	},
	{
		path: ChatController.GET_CHAT_BY_USER_ID,
		method: RequestMethod.GET,
	},
	{
		path: UserController.UPDATE_USER,
		method: RequestMethod.PATCH,
	},
];

@Module({
	imports: [
		FirebaseModule,
		PrismaModule,
		JwtModule.register({
			secret: envs.JWT_KEY,
			signOptions: { expiresIn: envs.JWT_TIME },
		}),
	],
	controllers: [AuthController],
	providers: [...providers],
	exports: [...providers],
})

export class AuthModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(MustBeConnected)
			.forRoutes(...mustBeConnectedRoutes);
	}
}
