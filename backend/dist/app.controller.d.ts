import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema';
import { MalwareDetectionService } from './malware-detection.service';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    private readonly malwareDetectionService;
    private analyzedEmailModel;
    constructor(appService: AppService, configService: ConfigService, malwareDetectionService: MalwareDetectionService, analyzedEmailModel: Model<AnalyzedEmail>);
    getHello(): string;
    getAnalyzedEmails(): Promise<(import("mongoose").Document<unknown, {}, AnalyzedEmail, {}, {}> & AnalyzedEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTestEmail(): {
        email: any;
    };
    analyzeMalware(emailData: {
        subject?: string;
        body?: string;
        sender?: string;
        headers?: string;
        attachments?: string[];
    }): Promise<any>;
    analyzeBatch(emails: Array<{
        subject?: string;
        body?: string;
        sender?: string;
        headers?: string;
        attachments?: string[];
    }>): Promise<any>;
    getHealth(): {
        status: string;
        timestamp: Date;
    };
}
