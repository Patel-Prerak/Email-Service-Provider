import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema';
import { MalwareDetectionService } from './malware-detection.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly malwareDetectionService: MalwareDetectionService,
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

  @Post('analyze-malware')
  async analyzeMalware(
    @Body() emailData: {
      subject?: string;
      body?: string;
      sender?: string;
      headers?: string;
      attachments?: string[];
    }
  ): Promise<any> {
    return this.malwareDetectionService.detectMalware(emailData);
  }

  @Post('analyze-batch')
  async analyzeBatch(
    @Body() emails: Array<{
      subject?: string;
      body?: string;
      sender?: string;
      headers?: string;
      attachments?: string[];
    }>
  ): Promise<any> {
    return this.malwareDetectionService.detectMalwareBatch(emails);
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date() };
  }
}
