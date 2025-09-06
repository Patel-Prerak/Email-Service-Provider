import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema';
import { EmailAnalysisService } from './email-analysis.service';
export declare class ImapService {
    private readonly configService;
    private readonly analysisService;
    private analyzedEmailModel;
    private readonly logger;
    private isRunning;
    constructor(configService: ConfigService, analysisService: EmailAnalysisService, analyzedEmailModel: Model<AnalyzedEmail>);
    handleCron(): Promise<void>;
}
