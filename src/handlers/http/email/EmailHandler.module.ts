import { Module } from '@nestjs/common';
import EmailCoreModule from '../../../cores/email/EmailCore.module';
import { EmailHandlerController } from './EmailHandler.controller';
import UserCoreModule from '../../../cores/user/UserCore.module';

@Module({
  imports: [EmailCoreModule, UserCoreModule],
  controllers: [EmailHandlerController],
})
export class EmailHandlerModule {}
