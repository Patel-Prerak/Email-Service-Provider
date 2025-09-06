import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ImapService } from './imap.service';
import { EmailAnalysisService } from './email-analysis.service';
import { AnalyzedEmail, AnalyzedEmailSchema } from './schemas/email.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/email-analyzer'),
    MongooseModule.forFeature([{ name: AnalyzedEmail.name, schema: AnalyzedEmailSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, ImapService, EmailAnalysisService],
})
export class AppModule {}
