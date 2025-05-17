import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import envs from "@/envs";

void NestFactory.create(AppModule)
	.then(
		async(app) => {
			app.enableCors();
			await app.listen(
				envs.PORT,
			);
		},
	);
