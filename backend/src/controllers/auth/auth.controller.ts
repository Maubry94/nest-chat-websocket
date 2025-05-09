import { CurrentUser } from "@/guards/auth/must-be-connected.guard";
import { LoginDto } from "@/schemas/auth/login";
import { TokenService } from "@/services/auth/token";
import { FindOrCreateUserUsecase } from "@/services/auth/usecases/findOrCreateUser";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { User } from "@prisma/client";

@Controller()
export class AuthController {
	public constructor(
		private readonly tokenService: TokenService,
		private readonly findOrCreateUser: FindOrCreateUserUsecase,
	) {}

	@Post("/authentication")
	public async login(@Body() body: LoginDto) {
		const email = await this.tokenService.checkFirebaseToken(body.firebaseToken);

		const user = await this.findOrCreateUser.execute({
			email,
		});

		return this.tokenService.generateToken(user);
	}

	@Get("/user")
	public getUser(@CurrentUser() user: User) {
		return user;
	}
}
