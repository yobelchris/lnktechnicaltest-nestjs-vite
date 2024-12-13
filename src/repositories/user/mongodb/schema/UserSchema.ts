import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import UserDTO from '../../../../cores/user/dto/UserDTO';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    unique: true,
  })
  username: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;

  @Prop()
  lastLogin: Date;

  @Prop()
  lastLogout: Date;

  ToDTO: () => UserDTO;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.ToDTO = function (): UserDTO {
  return new UserDTO(
    this._id.toString(),
    this.username,
    this.password,
    this.refreshToken,
    this.lastLogin,
    this.lastLogout,
    this.createdAt,
    this.updatedAt,
  );
};
