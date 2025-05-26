import { LoginDto } from "@/modules/auth/schemas/login";
import { TokenService } from "@/modules/auth/services/token";
import { FindOrCreateUserUsecase } from "@/modules/user/services/usecases/findOrCreateUser";
import { Body, Controller, Post } from "@nestjs/common";

@Controller()
export class AuthController {
	public constructor(
		private readonly tokenService: TokenService,
		private readonly findOrCreateUser: FindOrCreateUserUsecase,
	) {}

	public static readonly AUTHENTICATION = "/authentication";

	@Post(AuthController.AUTHENTICATION)
	public async login(@Body() body: LoginDto) {
		const email = await this.tokenService.checkFirebaseToken(body.firebaseToken);

		const user = await this.findOrCreateUser.execute({
			email,
		});

		return this.tokenService.generateToken(user);
	}
}
