import { UserSearchDto, userSearchSchema } from "@/schemas/user/search";
import { UserService } from "@/services/user/user.service";
import { Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { z } from "zod";

@Controller()
export class UserController {
	public constructor(
		private readonly userService: UserService,
	) {}

	private static readonly SEARCH_BY_USERNAME = "/users";

	@Get(UserController.SEARCH_BY_USERNAME)
	public async searchByUsername(@Query(new ZodValidationPipe(userSearchSchema)) search: UserSearchDto) {
		return this.userService.searchByUsername(search.username);
	}
}
