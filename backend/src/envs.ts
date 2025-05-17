import { config as importEnvFile } from "dotenv";
import { expand as expandEnv } from "dotenv-expand";
import { z } from "zod";

const DEFAULT_PORT = 1506;
const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_ENVIRONMENT = "DEV";

for (const pathEnv of [".env.local", ".env"]) {
	expandEnv(
		importEnvFile({ path: pathEnv }),
	);
}

export default global.ENV = z
	.object({
		PORT: z.coerce.number().default(DEFAULT_PORT),
		CHAT_GATEWAY_PORT: z.coerce.number(),
		HOST: z.string().default(DEFAULT_HOST),
		REDIS_HOST: z.string(),
		REDIS_PORT: z.coerce.number(),
		ENVIRONMENT: z.enum(["DEV", "PROD", "TEST"]).default(DEFAULT_ENVIRONMENT),
		FIREBASE_CREDENTIAL_PATH: z.string(),
		JWT_KEY: z.string(),
		JWT_TIME: z.coerce.number(),
		MONGO_DB_NAME: z.string(),
		MONGO_DATABASE_URL: z.string(),
	})
	.readonly()
	.parse(process.env);
