import { Email, EmailDocument } from './schema/EmailSchema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import EmailDTO from '../../../cores/email/dto/EmailDTO';
import { DataNotFound } from '../../../libs/errors/DataError';
import { IEmailRepository } from '../IEmailRepository';

export default class EmailMongoRepository implements IEmailRepository {
  constructor(@InjectModel('Email') private readonly email: Model<Email>) {}

  private EmailModelFromDTO(dto: EmailDTO): EmailDocument {
    return new this.email({
      userID: dto.userID,
      email: dto.email,
      date: dto.date,
      description: dto.description,
    });
  }

  public async InsertUserEmail(email: EmailDTO): Promise<void> {
    const emailModel = this.EmailModelFromDTO(email);
    await emailModel.save();
  }

  public async GetUserEmailsByDate(
    userID: string,
    startDate: Date,
    endDate: Date,
  ): Promise<EmailDTO[]> {
    const emails = await this.email
      .find({ userID: userID, date: { $gte: startDate, $lte: endDate } })
      .sort({
        date: 1,
        email: 1,
      });

    if (!emails) {
      throw new DataNotFound('emails not found');
    }

    return emails.map((email) => email.ToDTO());
  }
}
