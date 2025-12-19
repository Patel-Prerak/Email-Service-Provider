import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    logger.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    logger.log('AppModule created successfully');
    
    app.enableCors();
    logger.log('CORS enabled');
    
    const port = process.env.PORT ?? 3002;
    await app.listen(port);
    logger.log(`✅ Application listening on port ${port}`);
  } catch (error) {
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
