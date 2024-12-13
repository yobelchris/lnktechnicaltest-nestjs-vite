import EmailDTO from '../../cores/email/dto/EmailDTO';

export const IEmailRepository = Symbol('IEmailRepository');

export interface IEmailRepository {
  InsertUserEmail(email: EmailDTO): Promise<void>;

  GetUserEmailsByDate(
    userID: string,
    startDate: Date,
    endDate: Date,
  ): Promise<EmailDTO[]>;
}
