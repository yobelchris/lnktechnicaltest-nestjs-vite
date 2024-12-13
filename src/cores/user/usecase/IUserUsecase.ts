import UserDTO from '../dto/UserDTO';

export const IUserUsecase = Symbol('IUserUsecase');

export interface IUserUsecase {
  Login(username: string, password: string): Promise<UserDTO>;
  GetUserById(id: string): Promise<UserDTO>;
  UpdateRefreshToken(id: string, refreshToken: string): Promise<void>;
  Logout(id: string): Promise<void>;
}
