import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import StandardResponse from '../response/StandardResponse';

export default class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = new Map<string, string>();

        errors.forEach((error) => {
          const constraints = Object.values(error.constraints || {});
          if (constraints.length) {
            validationErrors.set(error.property, constraints.join(', '));
          }
        });

        const response = new StandardResponse();
        response.message = 'please check your payload';
        response.validationErrors = validationErrors;

        return new BadRequestException(response.toObject());
      },
    });
  }
}
