import { UserRepository } from "@/repositories/auth/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
	public constructor(
		private readonly userRepository: UserRepository,
	) {}

	public async searchByUsername(username: string) {
		return this.userRepository.searchByUsername(username);
	}
}
