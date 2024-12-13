import { Module } from '@nestjs/common';
import EmailUsecase from './usecase/EmailUsecase';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ConfigConst } from '../../libs/constant/Config';
import { EmailRepositoryModule } from '../../repositories/email/EmailRepository.module';
import { IEmailUsecase } from './usecase/IEmailUsecase';

@Module({
  imports: [
    EmailRepositoryModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>(ConfigConst.EMAIL_USER),
            pass: configService.get<string>(ConfigConst.EMAIL_PASSWORD),
          },
        },
        defaults: {
          from: configService.get<string>(ConfigConst.EMAIL_USER),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: IEmailUsecase,
      useClass: EmailUsecase,
    },
  ],
  exports: [IEmailUsecase],
})
export default class EmailCoreModule {}
