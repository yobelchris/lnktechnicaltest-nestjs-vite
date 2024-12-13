import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './mongodb/schema/UserSchema';
import UserMongoRepository from './mongodb/UserMongoRepository';
import { IUserRepository } from './IUserRepository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserMongoRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserRepositoryModule {}
