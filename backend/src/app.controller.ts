import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @InjectModel(AnalyzedEmail.name) private analyzedEmailModel: Model<AnalyzedEmail>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('emails')
  async getAnalyzedEmails() {
    return this.analyzedEmailModel.find().sort({ createdAt: -1 }).exec();
  }

  @Get('test-email')
  getTestEmail() {
    const email = this.configService.get('IMAP_USER');
    return { email: email || 'Configure IMAP_USER in .env file' };
  }
}
