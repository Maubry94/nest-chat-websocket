import { Module, Provider } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./modules/auth/auth.module";

const providers: Provider[] = [
	{
		provide: APP_PIPE,
		useClass: ZodValidationPipe,
	},
	AppService,

];

@Module({
	imports: [AuthModule],
	controllers: [AppController],
	providers: [...providers],
})
export class AppModule {}
