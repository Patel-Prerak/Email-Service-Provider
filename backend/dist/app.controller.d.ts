import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AnalyzedEmail } from './schemas/email.schema';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    private analyzedEmailModel;
    constructor(appService: AppService, configService: ConfigService, analyzedEmailModel: Model<AnalyzedEmail>);
    getHello(): string;
    getAnalyzedEmails(): Promise<(import("mongoose").Document<unknown, {}, AnalyzedEmail, {}, {}> & AnalyzedEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTestEmail(): {
        email: any;
    };
}
