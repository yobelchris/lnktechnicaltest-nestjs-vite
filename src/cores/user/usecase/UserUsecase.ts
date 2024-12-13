import * as bcrypt from 'bcrypt';
import { IUserUsecase } from './IUserUsecase';
import { IUserRepository } from '../../../repositories/user/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';
import UserDTO from '../dto/UserDTO';
import { UserAuthError } from '../../../libs/errors/AuthError';

@Injectable()
export default class UserUsecase implements IUserUsecase {
  constructor(
    @Inject(IUserRepository) private readonly repository: IUserRepository,
  ) {}

  public async Login(username: string, password: string): Promise<UserDTO> {
    const user = await this.repository.GetUserByUsername(username);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UserAuthError('password not match');
    }

    await this.repository.UpdateLastLogin(user.id);

    return user;
  }

  public async GetUserById(id: string): Promise<UserDTO> {
    return await this.repository.GetUserById(id);
  }

  public async UpdateRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    return await this.repository.UpdateRefreshToken(id, refreshToken);
  }

  public async Logout(id: string): Promise<void> {
    return await this.repository.UpdateLastLogout(id);
  }
}
