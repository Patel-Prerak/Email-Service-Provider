import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema'; 
import { EmailAnalysisService } from './email-analysis.service'; 

@Injectable()
export class ImapService {
  
  private readonly logger = new Logger(ImapService.name);
  
  
  private isRunning = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly analysisService: EmailAnalysisService,
    @InjectModel(AnalyzedEmail.name) private analyzedEmailModel: Model<AnalyzedEmail>,
  ) {}


  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    if (this.isRunning) {
      this.logger.warn('Previous IMAP check is still running. Skipping this cycle.');
      return;
    }

    this.isRunning = true;
    this.logger.log('Starting to check for new emails...');

   
    const config = {
      imap: {
        user: this.configService.get('IMAP_USER'),
        password: this.configService.get('IMAP_PASSWORD'),
        host: this.configService.get('IMAP_HOST'),
        port: this.configService.get('IMAP_PORT'),
        tls: true,
        authTimeout: 5000,
        tlsOptions: { rejectUnauthorized: false }
      },
    };

    try {
      const connection = await imaps.connect(config);
      this.logger.log('Successfully connected to IMAP server.');

      await connection.openBox('INBOX');
      this.logger.log('Inbox opened.');

      const searchCriteria = ['UNSEEN', ['HEADER', 'SUBJECT', 'analyzer-']];
     
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

      const messages = await connection.search(searchCriteria, fetchOptions);
      this.logger.log(`Found ${messages.length} new email(s).`);

      for (const item of messages) {
        
        const header = item.parts.find(part => part.which === 'HEADER').body;

        this.logger.log('Raw header:', JSON.stringify(header));

     
        const subject = header.subject ? header.subject[0] : undefined;

        this.logger.log(`Email subject found: ${subject}`);

      
        if (subject && subject.startsWith('analyzer-')) {
          this.logger.log(`Processing email with subject: ${subject}`);

          
          const receivingChain = this.analysisService.extractReceivingChain(header);
          const esp = this.analysisService.detectEsp(header);

          const newAnalysis = new this.analyzedEmailModel({
            subject: subject,
            receivingChain,
            esp,
            rawHeaders: header, 
          });

          await newAnalysis.save();
          this.logger.log(`✅ Successfully saved analysis for ${subject}`);
        }
      }

      await connection.end();
    } catch (error) {
      this.logger.error('An error occurred during the IMAP process.', error.stack);

      
      if (error.message && error.message.includes('authentication')) {
        this.logger.error('IMAP authentication failed. Please check your credentials in .env file.');
      } else if (error.message && error.message.includes('connect')) {
        this.logger.error('IMAP connection failed. Please check your IMAP host and port settings.');
      } else if (error.message && error.message.includes('certificate')) {
        this.logger.error('SSL/TLS certificate error. You may need to set tlsOptions.rejectUnauthorized to false for some providers.');
      }
    } finally {
      
      this.isRunning = false;
      this.logger.log('Finished email check cycle.');
    }
  }
}
