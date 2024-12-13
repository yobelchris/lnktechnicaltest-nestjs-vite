import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IEmailUsecase } from '../../../cores/email/usecase/IEmailUsecase';
import { GetEmailRequest, SendEmailRequest } from './request/RequestPayload';
import StandardResponse from '../../../libs/response/StandardResponse';
import BaseError from '../../../libs/errors/BaseError';
import { RequestContextConst } from '../../../libs/constant/RequestContext';
import UserDTO from '../../../cores/user/dto/UserDTO';
import EmailDTO from '../../../cores/email/dto/EmailDTO';
import { JWTHTTPGuard } from '../../../auth/jwt/http/JWTHTTP.guard';
import { GetEmailResponse } from './response/ResponsePayload';

@Controller('email')
export class EmailHandlerController {
  constructor(@Inject(IEmailUsecase) private readonly usecase: IEmailUsecase) {}

  @UseGuards(JWTHTTPGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  async SendEmail(@Body() reqPayload: SendEmailRequest, @Request() req: any) {
    const response = new StandardResponse();
    try {
      const userRequest = req[RequestContextConst.USER] as UserDTO;

      await this.usecase.SendEmail(
        new EmailDTO(
          '',
          userRequest.id,
          reqPayload.email,
          new Date(reqPayload.date),
          reqPayload.description,
        ),
      );

      response.message = 'send email success';
      return response.toObject();
    } catch (e: any) {
      console.error('ERROR SENDING EMAIL : ', e);

      if (e instanceof BaseError) {
        response.message = e.message;
        throw new HttpException(response.toObject(), e.statusCode);
      }

      response.message = 'send email error';
      throw new InternalServerErrorException(response.toObject());
    }
  }

  @UseGuards(JWTHTTPGuard)
  @Get()
  async GetEmail(@Query() reqPayload: GetEmailRequest, @Request() req: any) {
    const response = new StandardResponse();
    try {
      const userRequest = req[RequestContextConst.USER] as UserDTO;

      const emails = await this.usecase.GetEmails(
        userRequest.id,
        new Date(reqPayload.startDate),
        new Date(reqPayload.endDate),
      );

      response.message = 'get email success';
      response.data = emails.map((email) => {
        return new GetEmailResponse(
          email.email,
          email.date.toISOString().split('T')[0],
          email.description,
        );
      });
      return response.toObject();
    } catch (e: any) {
      console.error('ERROR GETTING EMAIL : ', e);

      if (e instanceof BaseError) {
        response.message = e.message;
        throw new HttpException(response.toObject(), e.statusCode);
      }

      response.message = 'get email error';
      throw new InternalServerErrorException(response.toObject());
    }
  }
}
