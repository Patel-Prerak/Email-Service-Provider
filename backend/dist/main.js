"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('Bootstrap');
async function bootstrap() {
    try {
        logger.log('Starting NestJS application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        logger.log('AppModule created successfully');
        app.enableCors();
        logger.log('CORS enabled');
        const port = process.env.PORT ?? 3002;
        await app.listen(port);
        logger.log(`✅ Application listening on port ${port}`);
    }
    catch (error) {
        logger.error('Fatal error during bootstrap:', error);
        logger.error('Error details:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
        });
        process.exit(1);
    }
}
bootstrap().catch(error => {
    logger.error('Uncaught error in bootstrap:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map