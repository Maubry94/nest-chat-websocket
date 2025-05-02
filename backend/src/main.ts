import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import envs from "./envs";

void NestFactory.create(AppModule)
	.then(
		(app) => app.listen(envs.NEST_PORT),
	);
