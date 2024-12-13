import EmailDTO from '../dto/EmailDTO';

export const IEmailUsecase = Symbol('IEmailUsecase');

export interface IEmailUsecase {
  SendEmail(email: EmailDTO): Promise<void>;

  GetEmails(
    userID: string,
    startDate: Date,
    endDate: Date,
  ): Promise<EmailDTO[]>;
}
