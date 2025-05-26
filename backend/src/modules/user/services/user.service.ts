import { UserRepository } from "@/modules/user/repositories/user";
import { Injectable, NotFoundException } from "@nestjs/common";

interface InputUpdateUserProfileColor {
	userId: string;
	profileColor: string;
}
@Injectable()
export class UserService {
	public constructor(
		private readonly userRepository: UserRepository,
	) {}

	public async searchByUsername(username: string) {
		return this.userRepository.searchByUsername(username);
	}

	public async updateUserProfileColor(params: InputUpdateUserProfileColor) {
		const { userId, profileColor } = params;

		const user = await this.getUserById(userId);

		user.profileColor = profileColor;

		return this.userRepository.updateUserProfileColor(user);
	}

	public async getUserById(id: string) {
		const user = await this.userRepository.findOneById(id);

		if (!user) {
			throw new NotFoundException("user.notFound");
		}

		return user;
	}
}
