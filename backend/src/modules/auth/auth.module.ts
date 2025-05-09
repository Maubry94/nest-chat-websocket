import { MiddlewareConsumer, Module, NestModule, RequestMethod, type Provider } from "@nestjs/common";
import { PrismaModule } from "@/providers/prisma/prisma.module";
import { FirebaseModule } from "@/providers/firebase/firebase.module";
import { UserRepository } from "@/repositories/auth/user";
import { TokenService } from "@/services/auth/token";
import { FindOrCreateUserUsecase } from "@/services/auth/usecases/findOrCreateUser";
import { AuthController } from "@/controllers/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import envs from "@/envs";
import { MustBeConnected } from "@/guards/auth/must-be-connected.guard";
import { RouteInfo } from "@nestjs/common/interfaces";

const providers: Provider[] = [
	FindOrCreateUserUsecase,
	UserRepository,
	TokenService,
];

const mustBeConnectedRoutes: RouteInfo[] = [
	{
		path: "/user",
		method: RequestMethod.GET,
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
