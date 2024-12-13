import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post, Put,
  Request,
  UseGuards
} from "@nestjs/common";
import { IUserUsecase } from '../../../cores/user/usecase/IUserUsecase';
import { LoginRequest } from './request/RequestPayload';
import StandardResponse from '../../../libs/response/StandardResponse';
import { LoginResponse, RefreshTokenResponse } from "./response/ResponsePayload";
import { UserAuthError } from '../../../libs/errors/AuthError';
import BaseError from '../../../libs/errors/BaseError';
import { ProviderConst } from '../../../libs/constant/Provider';
import { JwtService } from '@nestjs/jwt';
import JWTPayload from '../../../auth/jwt/JWTPayload';
import { RequestContextConst } from '../../../libs/constant/RequestContext';
import UserDTO from '../../../cores/user/dto/UserDTO';
import { JWTHTTPGuard } from '../../../auth/jwt/http/JWTHTTP.guard';
import { RefreshJWTHTTPGuard } from "../../../auth/jwt/http/RefreshJWTHTTP.guard";

@Controller()
export class UserHandlerController {
  constructor(
    @Inject(IUserUsecase)
    private readonly usecase: IUserUsecase,
    @Inject(ProviderConst.ACCESS_TOKEN_JWT)
    private readonly accessJwt: JwtService,
    @Inject(ProviderConst.REFRESH_TOKEN_JWT)
    private readonly refreshJwt: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async Login(@Body() req: LoginRequest) {
    const response: StandardResponse = new StandardResponse();

    try {
      const user = await this.usecase.Login(req.username, req.password);
      const jwtPayload = new JWTPayload(user.id);

      const token = await this.accessJwt.signAsync(jwtPayload.ToObject());

      const refreshToken = await this.refreshJwt.signAsync(
        jwtPayload.ToObject(),
      );

      await this.usecase.UpdateRefreshToken(user.id, refreshToken);

      response.message = 'login success';
      response.data = new LoginResponse(token, refreshToken);
      return response.toObject();
    } catch (e: any) {
      console.error('ERROR LOGIN : ', e);
      if (e instanceof UserAuthError) {
        response.message = 'please check your username and password';
        throw new HttpException(response, e.statusCode);
      }

      if (e instanceof BaseError) {
        response.message = e.message;
        throw new HttpException(response.toObject(), e.statusCode);
      }

      response.message = 'login error';
      throw new InternalServerErrorException(response.toObject());
    }
  }

  @UseGuards(RefreshJWTHTTPGuard)
  @HttpCode(HttpStatus.OK)
  @Put('refresh')
  async RefreshToken(@Request() req: any) {
    const response = new StandardResponse();
    try {
      const userRequest = req[RequestContextConst.USER] as UserDTO;
      const jwtPayload = new JWTPayload(userRequest.id);

      const token = await this.accessJwt.signAsync(jwtPayload.ToObject());

      const refreshToken = await this.refreshJwt.signAsync(
        jwtPayload.ToObject(),
      );

      await this.usecase.UpdateRefreshToken(userRequest.id, refreshToken);

      response.message = 'refresh token success';
      response.data = new RefreshTokenResponse(token, refreshToken);
      return response.toObject();
    } catch (e: any) {
      console.error('ERROR REFRESH TOKEN : ', e);
      if (e instanceof BaseError) {
        response.message = e.message;
        throw new HttpException(response.toObject(), e.statusCode);
      }

      response.message = 'refresh token error';
      throw new InternalServerErrorException(response.toObject());
    }
  }

  @UseGuards(JWTHTTPGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async Logout(@Request() req: any) {
    const response = new StandardResponse();
    try {
      const userRequest = req[RequestContextConst.USER] as UserDTO;
      const user = await this.usecase.GetUserById(userRequest.id);
      await this.usecase.Logout(user.id);
      await this.usecase.UpdateRefreshToken(user.id, '');
      response.message = 'logout success';
      return response.toObject();
    } catch (e: any) {
      console.error('ERROR LOGOUT : ', e);
      if (e instanceof BaseError) {
        response.message = e.message;
        throw new HttpException(response.toObject(), e.statusCode);
      }

      response.message = 'logout error';
      throw new InternalServerErrorException(response.toObject());
    }
  }
}
