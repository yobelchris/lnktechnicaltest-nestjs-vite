import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import EmailDTO from '../../../../cores/email/dto/EmailDTO';

export type EmailDocument = HydratedDocument<Email>;

@Schema({
  timestamps: true,
})
export class Email {
  @Prop()
  userID: string;

  @Prop()
  email: string;

  @Prop()
  date: Date;

  @Prop()
  description: string;

  ToDTO: () => EmailDTO;

  static FromDTO: (dto: EmailDTO) => Partial<Email>;
}

export const EmailSchema = SchemaFactory.createForClass(Email);

EmailSchema.methods.ToDTO = function (): EmailDTO {
  return new EmailDTO(
    this._id.toString(),
    this.userID,
    this.email,
    this.date,
    this.description,
    this.createdAt,
    this.updatedAt,
  );
};

EmailSchema.statics.FromDTO = function (dto: EmailDTO): Partial<Email> {
  return {
    userID: dto.userID,
    email: dto.email,
    date: dto.date,
    description: dto.description,
  };
};
