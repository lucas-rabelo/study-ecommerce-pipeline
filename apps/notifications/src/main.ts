import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module.js';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  await app.listen(process.env.NOTIFICATIONS_PORT ?? 5004);
}
await bootstrap();
