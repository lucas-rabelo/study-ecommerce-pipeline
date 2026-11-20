import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsConsumer } from './notifications.consumer.js';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  providers: [NotificationsConsumer],
})
export class NotificationsModule {}
