import { PrismaService } from "@/providers/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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
}
