import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { type User } from "@prisma/client";
import { type AbstractUsecase } from "@/common/AbstractUsecase";
import { UserRepository } from "@/modules/user/repositories/user";

interface Input {
	email: string;
}

@Injectable()
export class FindOrCreateUserUsecase implements AbstractUsecase<Input, User> {
	public constructor(
		private readonly userRepository: UserRepository,
	) {}

	public async execute(input: Input) {
		const { email } = input;

		let user = await this.userRepository.findOneByEmail(email);

		if (!user) {
			const username = email.split("@").shift();

			if (!username) {
				throw new UnprocessableEntityException("Cannot extract username from email");
			}

			user = await this.userRepository.createUser({
				email,
				username,
			});
		}

		return user;
	}
}
