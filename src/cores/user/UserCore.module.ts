import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../../repositories/user/UserRepository.module';
import UserUsecase from './usecase/UserUsecase';
import { IUserUsecase } from './usecase/IUserUsecase';

@Module({
  imports: [UserRepositoryModule],
  providers: [
    {
      provide: IUserUsecase,
      useClass: UserUsecase,
    },
  ],
  exports: [IUserUsecase],
})
export default class UserCoreModule {}
