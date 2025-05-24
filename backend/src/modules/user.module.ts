import { Module, Provider } from "@nestjs/common";
import { UserController } from "@/controllers/user.controller";
import { PrismaModule } from "@/providers/prisma/prisma.module";
import { UserRepository } from "@/repositories/auth/user";
import { UserService } from "@/services/user/user.service";

const providers: Provider[] = [UserRepository, UserService];

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [...providers],
})
export class UserModule {}
