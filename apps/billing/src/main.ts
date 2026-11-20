import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module.js';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  await app.listen(process.env.BILLING_PORT ?? 5002);
  app.enableShutdownHooks();
}
await bootstrap();
