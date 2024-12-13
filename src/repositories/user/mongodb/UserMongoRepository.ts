import { IUserRepository } from '../IUserRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/UserSchema';
import UserDTO from '../../../cores/user/dto/UserDTO';
import { DataNotFound, DataNotUpdated } from '../../../libs/errors/DataError';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserMongoRepository implements IUserRepository {
  constructor(@InjectModel('User') private readonly user: Model<User>) {}

  public async GetUserByUsername(username: string): Promise<UserDTO> {
    const user = await this.user.findOne({ username: username });

    if (!user) {
      throw new DataNotFound('user not found');
    }

    return user.ToDTO();
  }

  public async GetUserById(id: string): Promise<UserDTO> {
    const user = await this.user.findById(id);

    if (!user) {
      throw new DataNotFound('user not found');
    }

    return user.ToDTO();
  }

  public async UpdateRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    const res = await this.user.updateOne(
      { _id: id },
      { $set: { refreshToken: refreshToken } },
    );

    if (!res.acknowledged) {
      throw new DataNotUpdated('update refresh token failed');
    }
  }

  public async UpdateLastLogin(id: string): Promise<void> {
    const res = await this.user.updateOne(
      { _id: id },
      { $set: { lastLogin: new Date() } },
    );

    if (!res.acknowledged) {
      throw new DataNotUpdated('update last login failed');
    }

    if (res.matchedCount === 0) {
      throw new DataNotFound('user not found');
    }
  }

  public async UpdateLastLogout(id: string): Promise<void> {
    const res = await this.user.updateOne(
      { _id: id },
      { $set: { lastLogout: new Date() } },
    );

    if (!res.acknowledged) {
      throw new DataNotUpdated('update last logout failed');
    }

    if (res.matchedCount === 0) {
      throw new DataNotFound('user not found');
    }
  }
}
