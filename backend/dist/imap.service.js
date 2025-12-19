"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ImapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const imaps = __importStar(require("imap-simple"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const email_schema_1 = require("./schemas/email.schema");
const email_analysis_service_1 = require("./email-analysis.service");
const malware_detection_service_1 = require("./malware-detection.service");
let ImapService = ImapService_1 = class ImapService {
    configService;
    analysisService;
    malwareDetectionService;
    analyzedEmailModel;
    logger = new common_1.Logger(ImapService_1.name);
    isRunning = false;
    constructor(configService, analysisService, malwareDetectionService, analyzedEmailModel) {
        this.configService = configService;
        this.analysisService = analysisService;
        this.malwareDetectionService = malwareDetectionService;
        this.analyzedEmailModel = analyzedEmailModel;
    }
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
            const searchCriteria = ['UNSEEN'];
            const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
            let messages = await connection.search(searchCriteria, fetchOptions);
            this.logger.log(`Found ${messages.length} new unseen email(s).`);
            for (const item of messages) {
                const header = item.parts.find(part => part.which === 'HEADER').body;
                this.logger.log('Raw header:', JSON.stringify(header));
                const subject = header.subject ? header.subject[0] : undefined;
                this.logger.log(`Email subject found: ${subject}`);
                if (subject) {
                    this.logger.log(`Processing email with subject: ${subject}`);
                    const receivingChain = this.analysisService.extractReceivingChain(header);
                    const esp = this.analysisService.detectEsp(header);
                    let phishingResult = null;
                    try {
                        const emailBody = item.parts.find(part => part.which === 'TEXT')?.body || '';
                        phishingResult = await this.malwareDetectionService.detectMalware({
                            subject: subject,
                            body: emailBody,
                            receivingChain: receivingChain,
                            esp: esp,
                            spfPass: header['authentication-results'] && header['authentication-results'].includes('spf=pass'),
                            dkimPass: header['authentication-results'] && header['authentication-results'].includes('dkim=pass'),
                            dmarcPass: header['authentication-results'] && header['authentication-results'].includes('dmarc=pass'),
                        });
                        this.logger.log(`Phishing detection result: ${JSON.stringify(phishingResult)}`);
                    }
                    catch (error) {
                        this.logger.warn(`Phishing detection failed for ${subject}: ${error?.message || error}`);
                        phishingResult = { is_phishing: false, confidence: 0, risk_level: 'UNKNOWN', message: error?.message || String(error) };
                    }
                    const newAnalysis = new this.analyzedEmailModel({
                        subject: subject,
                        receivingChain,
                        esp,
                        rawHeaders: header,
                        malwareResult: phishingResult,
                    });
                    await newAnalysis.save();
                    this.logger.log(`✅ Successfully saved analysis for ${subject}`);
                }
            }
            await connection.end();
        }
        catch (error) {
            this.logger.error('An error occurred during the IMAP process.', error.stack);
            if (error.message && error.message.includes('authentication')) {
                this.logger.error('IMAP authentication failed. Please check your credentials in .env file.');
            }
            else if (error.message && error.message.includes('connect')) {
                this.logger.error('IMAP connection failed. Please check your IMAP host and port settings.');
            }
            else if (error.message && error.message.includes('certificate')) {
                this.logger.error('SSL/TLS certificate error. You may need to set tlsOptions.rejectUnauthorized to false for some providers.');
            }
        }
        finally {
            this.isRunning = false;
            this.logger.log('Finished email check cycle.');
        }
    }
};
exports.ImapService = ImapService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImapService.prototype, "handleCron", null);
exports.ImapService = ImapService = ImapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(email_schema_1.AnalyzedEmail.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_analysis_service_1.EmailAnalysisService,
        malware_detection_service_1.MalwareDetectionService,
        mongoose_2.Model])
], ImapService);
//# sourceMappingURL=imap.service.js.map