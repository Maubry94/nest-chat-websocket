import envs from "@/envs";
import { Module, Provider } from "@nestjs/common";
import { Collection, Db, MongoClient } from "mongodb";
import { Message } from "./entities/message";

export interface MongoRepository {
	client: MongoClient;
	database: Db;
	messageCollection: Collection<Message>;
}

export const MongoProvider: Provider = {
	provide: "MONGO_REPOSITORY",
	useFactory: async() => {
		const client = new MongoClient(envs.MONGO_DATABASE_URL);
		await client.connect();

		const database = client.db(envs.MONGO_DB_NAME);
		const messageCollection = database.collection<Message>("messages");

		return {
			client,
			database,
			messageCollection,
		} as MongoRepository;
	},
};

@Module({
	providers: [MongoProvider],
	exports: [MongoProvider],
})
export class MongoModule {}
