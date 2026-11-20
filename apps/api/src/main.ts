import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module.js';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  await app.listen(process.env.API_PORT ?? 5001);
}
await bootstrap();
