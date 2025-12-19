import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema';
import { EmailAnalysisService } from './email-analysis.service';
import { MalwareDetectionService } from './malware-detection.service';
export declare class ImapService {
    private readonly configService;
    private readonly analysisService;
    private readonly malwareDetectionService;
    private analyzedEmailModel;
    private readonly logger;
    private isRunning;
    constructor(configService: ConfigService, analysisService: EmailAnalysisService, malwareDetectionService: MalwareDetectionService, analyzedEmailModel: Model<AnalyzedEmail>);
    handleCron(): Promise<void>;
}
