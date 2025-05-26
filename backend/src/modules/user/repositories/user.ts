import { PrismaService } from "@/providers/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

interface CreateUserInput {
	email: string;
	username: string;
}

@Injectable()
export class UserRepository {
	public constructor(private readonly prisma: PrismaService) {}

	public findOneByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	public findOneById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	public async createUser(input: CreateUserInput) {
		return this.prisma.user.create({
			data: {
				email: input.email,
				username: input.username,
			},
		});
	}

	public async updateUserProfileColor(user: User) {
		return this.prisma.user.update({
			where: { id: user.id },
			data: {
				profileColor: user.profileColor,
			},
		});
	}

	public async searchByUsername(username: string) {
		return this.prisma.user.findMany({
			where: {
				username: {
					contains: username,
					mode: "insensitive",
				},
			},
		});
	}
}
