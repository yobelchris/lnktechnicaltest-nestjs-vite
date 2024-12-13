import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProviderConst } from '../../../libs/constant/Provider';
import StandardResponse from '../../../libs/response/StandardResponse';
import JWTPayload from '../JWTPayload';
import BaseError from '../../../libs/errors/BaseError';
import { IUserUsecase } from '../../../cores/user/usecase/IUserUsecase';
import { UserAuthError } from '../../../libs/errors/AuthError';
import { RequestContextConst } from '../../../libs/constant/RequestContext';

@Injectable()
export class RefreshJWTHTTPGuard implements CanActivate {
  constructor(
    @Inject(ProviderConst.REFRESH_TOKEN_JWT)
    private readonly refreshJwt: JwtService,

    @Inject(IUserUsecase)
    private readonly userUsecase: IUserUsecase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = new StandardResponse();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      response.message = 'invalid token';
      throw new UnauthorizedException(response.toObject());
    }

    let payload: JWTPayload;

    try {
      payload = await this.refreshJwt.verifyAsync<JWTPayload>(token);
    } catch (e: any) {
      console.error('ERROR VERIFY REFRESH TOKEN : ', e);
      response.message = 'invalid token';
      throw new UnauthorizedException(response.toObject());
    }

    try {
      const user = await this.userUsecase.GetUserById(payload.id);

      if (user.refreshToken !== token) {
        throw new UserAuthError();
      }

      request[RequestContextConst.USER] = user;
    } catch (e: any) {
      console.error('ERROR GET USER BY ID FOR REFRESH TOKEN : ', e);
      if (e instanceof BaseError) {
        response.message = e.message;
        throw new HttpException(response.toObject(), e.statusCode);
      }

      response.message = 'token auth failed';
      throw new InternalServerErrorException(response.toObject());
    }

    return true;
  }
}
