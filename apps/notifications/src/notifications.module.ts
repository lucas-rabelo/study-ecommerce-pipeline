import { Module } from '@nestjs/common';
import { NotificationsConsumer } from './notifications.consumer.js';
@Module({
  providers: [NotificationsConsumer],
})
export class NotificationsModule {}
