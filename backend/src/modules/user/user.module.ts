import { Module, Provider } from "@nestjs/common";
import { UserController } from "@/modules/user/user.controller";
import { PrismaModule } from "@/providers/prisma/prisma.module";
import { UserRepository } from "@/modules/user/repositories/user";
import { UserService } from "@/modules/user/services/user.service";

const providers: Provider[] = [UserRepository, UserService];

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [...providers],
})
export class UserModule {}
