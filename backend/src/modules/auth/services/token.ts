import envs from "@/envs";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type User } from "@prisma/client";
import { type Auth } from "firebase-admin/lib/auth/auth";

interface AccessTokenContent {
	userId: string;
}

const { JWT_KEY, JWT_TIME } = envs;

@Injectable()
export class TokenService {
	public constructor(
		@Inject("FIREBASE_AUTH")
		private readonly firebaseAuth: Auth,
		private readonly jwt: JwtService,
	) {}

	public async checkFirebaseToken(token: string) {
		try {
			const firebaseToken = await this.firebaseAuth.verifyIdToken(token);

			const { email } = firebaseToken;

			if (!email) {
				throw new Error("Email not found in token");
			}

			return email;
		} catch {
			throw new UnauthorizedException("firebase.token.invalid");
		}
	}

	public generateToken(user: User) {
		const { id } = user;

		const payload: AccessTokenContent = {
			userId: id,
		};

		return this.jwt.sign(
			payload,
			{
				secret: JWT_KEY,
				expiresIn: JWT_TIME,
			},
		);
	}

	public checkToken(token: string): AccessTokenContent | null {
		try {
			const content = this.jwt.verify<AccessTokenContent>(
				token,
				{
					secret: JWT_KEY,
				},
			);

			if (!content) {
				throw new Error("Missing content AccessToken");
			}

			return content;
		} catch {
			return null;
		}
	}
}
