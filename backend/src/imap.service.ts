import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema'; // We will create this file next
import { EmailAnalysisService } from './email-analysis.service'; // And this one too

@Injectable()
export class ImapService {
  // Logger helps print formatted messages to the console, which is great for debugging.
  private readonly logger = new Logger(ImapService.name);
  
  // This flag prevents the task from running again if the previous one is still busy.
  private isRunning = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly analysisService: EmailAnalysisService,
    @InjectModel(AnalyzedEmail.name) private analyzedEmailModel: Model<AnalyzedEmail>,
  ) {}

  // This decorator turns this function into a scheduled task.
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    if (this.isRunning) {
      this.logger.warn('Previous IMAP check is still running. Skipping this cycle.');
      return;
    }

    this.isRunning = true;
    this.logger.log('Starting to check for new emails...');

    // We get the IMAP credentials securely from our .env file.
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

      // We search for emails that are 'UNSEEN' (unread).
      const searchCriteria = ['UNSEEN', ['HEADER', 'SUBJECT', 'analyzer-']];
      // We want the full email body and headers, and we want to mark them as read after fetching.
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

      const messages = await connection.search(searchCriteria, fetchOptions);
      this.logger.log(`Found ${messages.length} new email(s).`);

      for (const item of messages) {
        // The header is already parsed as an object by imap-simple.
        const header = item.parts.find(part => part.which === 'HEADER').body;

        this.logger.log('Raw header:', JSON.stringify(header));

        // Extract subject directly from the parsed header object.
        const subject = header.subject ? header.subject[0] : undefined;

        this.logger.log(`Email subject found: ${subject}`);

        // This is the crucial filter! We only process emails with the correct subject.
        if (subject && subject.startsWith('analyzer-')) {
          this.logger.log(`Processing email with subject: ${subject}`);

          // Here, we call the other service to do the actual analysis.
          const receivingChain = this.analysisService.extractReceivingChain(header);
          const esp = this.analysisService.detectEsp(header);

          // We create a new database entry with our findings.
          const newAnalysis = new this.analyzedEmailModel({
            subject: subject,
            receivingChain,
            esp,
            rawHeaders: header, // Header is already an object
          });

          // And we save it to MongoDB.
          await newAnalysis.save();
          this.logger.log(`✅ Successfully saved analysis for ${subject}`);
        }
      }

      await connection.end();
    } catch (error) {
      this.logger.error('An error occurred during the IMAP process.', error.stack);

      // Handle specific IMAP errors
      if (error.message && error.message.includes('authentication')) {
        this.logger.error('IMAP authentication failed. Please check your credentials in .env file.');
      } else if (error.message && error.message.includes('connect')) {
        this.logger.error('IMAP connection failed. Please check your IMAP host and port settings.');
      } else if (error.message && error.message.includes('certificate')) {
        this.logger.error('SSL/TLS certificate error. You may need to set tlsOptions.rejectUnauthorized to false for some providers.');
      }
    } finally {
      // It's very important to reset the flag, even if an error occurs.
      this.isRunning = false;
      this.logger.log('Finished email check cycle.');
    }
  }
}
