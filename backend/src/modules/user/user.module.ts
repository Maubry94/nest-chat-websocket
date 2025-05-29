import { Module, Provider } from "@nestjs/common";
import { UserController } from "@/modules/user/user.controller";
import { PrismaModule } from "@/providers/prisma/prisma.module";
import { UserRepository } from "@/modules/user/repositories/user";
import { UserService } from "@/modules/user/services/user.service";
import { ChatModule } from "../chat/chat.module";

const providers: Provider[] = [
	UserRepository,
	UserService,
];

@Module({
	imports: [PrismaModule, ChatModule],
	controllers: [UserController],
	providers: [...providers],
	exports: [...providers],
})
export class UserModule {}
