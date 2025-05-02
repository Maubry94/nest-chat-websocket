import { config as importEnvFile } from "dotenv";
import { expand as expandEnv } from "dotenv-expand";
import { z } from "zod";

const NEST_DEFAULT_PORT = 1506;
const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_ENVIRONMENT = "DEV";

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const ENV: (typeof import("./envs"))["default"];
}

for (const pathEnv of [".env.local", ".env"]) {
	expandEnv(
		importEnvFile({ path: pathEnv }),
	);
}

//@ts-expect-error var 'global' cause type error.
export default global.ENV = z
	.object({
		NEST_PORT: z.coerce.number().default(NEST_DEFAULT_PORT),
		NEST_HOST: z.string().default(DEFAULT_HOST),
		ENVIRONMENT: z.enum(["DEV", "PROD", "TEST"]).default(DEFAULT_ENVIRONMENT),
	})
	.readonly()
	.parse(process.env);
