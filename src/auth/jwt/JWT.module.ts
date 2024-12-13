import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderConst } from '../../libs/constant/Provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigConst } from '../../libs/constant/Config';
import { JWTHTTPGuard } from './http/JWTHTTP.guard';
import UserCoreModule from '../../cores/user/UserCore.module';
import { RefreshJWTHTTPGuard } from './http/RefreshJWTHTTP.guard';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: ProviderConst.ACCESS_TOKEN_JWT,
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>(ConfigConst.TOKEN_SECRET),
          signOptions: {
            expiresIn: configService.get<string>(ConfigConst.TOKEN_EXPIRES_IN),
          },
        });
      },
    },
    {
      inject: [ConfigService],
      provide: ProviderConst.REFRESH_TOKEN_JWT,
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>(ConfigConst.REFRESH_TOKEN_SECRET),
          signOptions: {
            expiresIn: configService.get<string>(
              ConfigConst.REFRESH_TOKEN_EXPIRES_IN,
            ),
          },
        });
      },
    },
  ],
  exports: [ProviderConst.ACCESS_TOKEN_JWT, ProviderConst.REFRESH_TOKEN_JWT],
})
export default class JWTModule {}
