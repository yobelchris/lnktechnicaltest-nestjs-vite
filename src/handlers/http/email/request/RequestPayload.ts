import { IsDateString, IsEmail, IsString } from 'class-validator';

export class SendEmailRequest {
  @IsEmail()
  email: string;

  @IsDateString()
  date: string;

  @IsString()
  description: string;
}

export class GetEmailRequest {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
