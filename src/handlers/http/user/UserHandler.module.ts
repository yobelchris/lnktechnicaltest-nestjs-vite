import { Module } from '@nestjs/common';
import UserCoreModule from '../../../cores/user/UserCore.module';
import { UserHandlerController } from './UserHandler.controller';

@Module({
  imports: [UserCoreModule],
  controllers: [UserHandlerController],
})
export class UserHandlerModule {}
