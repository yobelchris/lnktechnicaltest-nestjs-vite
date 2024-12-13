import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './mongodb/schema/EmailSchema';
import { IEmailRepository } from './IEmailRepository';
import EmailMongoRepository from './mongodb/EmailMongoRepository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }]),
  ],
  providers: [
    {
      provide: IEmailRepository,
      useClass: EmailMongoRepository,
    },
  ],
  exports: [IEmailRepository],
})
export class EmailRepositoryModule {}
