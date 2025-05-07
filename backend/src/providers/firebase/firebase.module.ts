import { Module, Provider } from "@nestjs/common";
import envs from "@/envs";
import firebaseAdmin, { type ServiceAccount } from "firebase-admin";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

export const FirebaseAuthProvider: Provider = {
	provide: "FIREBASE_AUTH",
	useFactory: async() => {
		if (!existsSync(envs.FIREBASE_CREDENTIAL_PATH)) {
			throw new Error("Firebase credential not found.");
		}

		const credential: ServiceAccount = JSON.parse(
			await readFile(envs.FIREBASE_CREDENTIAL_PATH, "utf-8"),
		);

		firebaseAdmin.initializeApp({
			credential: firebaseAdmin.credential.cert(credential),
		});

		const firebaseAuth = firebaseAdmin.auth();

		await firebaseAuth.getUsers([{ email: "liamdu92@gmail.com" }]);

		return firebaseAuth;
	},
};

@Module({
	providers: [FirebaseAuthProvider],
	exports: [FirebaseAuthProvider],
})
export class FirebaseModule {}
