"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const email_schema_1 = require("./schemas/email.schema");
let AppController = class AppController {
    appService;
    configService;
    analyzedEmailModel;
    constructor(appService, configService, analyzedEmailModel) {
        this.appService = appService;
        this.configService = configService;
        this.analyzedEmailModel = analyzedEmailModel;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getAnalyzedEmails() {
        return this.analyzedEmailModel.find().sort({ createdAt: -1 }).exec();
    }
    getTestEmail() {
        const email = this.configService.get('IMAP_USER');
        return { email: email || 'Configure IMAP_USER in .env file' };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('emails'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAnalyzedEmails", null);
__decorate([
    (0, common_1.Get)('test-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getTestEmail", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(2, (0, mongoose_1.InjectModel)(email_schema_1.AnalyzedEmail.name)),
    __metadata("design:paramtypes", [app_service_1.AppService,
        config_1.ConfigService,
        mongoose_2.Model])
], AppController);
//# sourceMappingURL=app.controller.js.map