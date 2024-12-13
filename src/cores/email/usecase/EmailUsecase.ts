import { IEmailUsecase } from './IEmailUsecase';
import { Inject, Injectable } from '@nestjs/common';
import { IEmailRepository } from '../../../repositories/email/IEmailRepository';
import EmailDTO from '../dto/EmailDTO';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export default class EmailUsecase implements IEmailUsecase {
  constructor(
    @Inject(IEmailRepository) private readonly repository: IEmailRepository,

    private readonly mailService: MailerService,
  ) {}

  public async SendEmail(email: EmailDTO): Promise<void> {
    await this.mailService.sendMail({
      to: email.email,
      subject: 'Test Technical LNK',
      text: email.description,
    });
    await this.repository.InsertUserEmail(email);
  }

  public async GetEmails(
    userID: string,
    startDate: Date,
    endDate: Date,
  ): Promise<EmailDTO[]> {
    return await this.repository.GetUserEmailsByDate(
      userID,
      startDate,
      endDate,
    );
  }
}
