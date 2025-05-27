import {
	createParamDecorator,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NestMiddleware,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UserRepository } from "@/modules/user/repositories/user";
import { TokenService } from "@/modules/auth/services/token";

declare module "express" {
	interface Request {
		user?: User;
	}
}

export const ConnectedUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();

		if (!request.user) {
			throw new InternalServerErrorException("error.whenRecoveringUserFromRequest");
		}

		return request.user;
	},
);

@Injectable()
export class MustBeConnected implements NestMiddleware {
	public constructor(
		private readonly tokenService: TokenService,
		private readonly userRepository: UserRepository,
	) {}

	public async use(request: Request, _response: Response, next: NextFunction) {
		if (!request.headers.authorization) {
			throw new ForbiddenException("authorization.missing");
		}

		const extractedToken = request.headers.authorization;
		const verifiedToken = this.tokenService.checkToken(extractedToken);

		if (!verifiedToken) {
			throw new UnauthorizedException("accessToken.invalid");
		}

		const { userId } = verifiedToken;

		const user = await this.userRepository.findOneById(userId);

		if (!user) {
			throw new NotFoundException("user.notfound");
		}

		request.user = user;
		next();
	}
}
