import { PrismaService } from "@/providers/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

interface CreateMessageInput {
}

@Injectable()
export class MessageRepository {
	public constructor(private readonly prisma: PrismaService) {}
}
