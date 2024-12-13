import UserDTO from '../../cores/user/dto/UserDTO';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  GetUserByUsername(username: string): Promise<UserDTO>;
  GetUserById(id: string): Promise<UserDTO>;
  UpdateRefreshToken(id: string, refreshToken: string): Promise<void>;
  UpdateLastLogin(id: string): Promise<void>;
  UpdateLastLogout(id: string): Promise<void>;
}
