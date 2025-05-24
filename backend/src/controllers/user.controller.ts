import { UserService } from "@/services/user/user.service";
import { Controller, Get, Query } from "@nestjs/common";

@Controller()
export class UserController {
	public constructor(
		private readonly userService: UserService,
	) {}

	private static readonly SEARCH_BY_USERNAME = "/users";

	@Get(UserController.SEARCH_BY_USERNAME)
	public async searchByUsername(@Query("username") username: string) {
		return this.userService.searchByUsername(username);
	}
}
