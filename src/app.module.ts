import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigConst } from './libs/constant/Config';
import { UserHandlerModule } from './handlers/http/user/UserHandler.module';
import JWTModule from './auth/jwt/JWT.module';
import { EmailHandlerModule } from './handlers/http/email/EmailHandler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>(ConfigConst.MONGO_USERNAME)}:${configService.get<string>(ConfigConst.MONGO_PASSWORD)}@${configService.get<string>(ConfigConst.MONGO_HOST)}:${configService.get<number>(ConfigConst.MONGO_PORT)}`,
        maxPoolSize: configService.get<number>(ConfigConst.MONGO_POOL_SIZE, 10),
        dbName: configService.get<string>(ConfigConst.MONGO_DATABASE),
      }),
    }),
    JWTModule,
    UserHandlerModule,
    EmailHandlerModule,
  ],
})
export class AppModule {}
