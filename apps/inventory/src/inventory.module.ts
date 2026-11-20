import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryConsumer } from './inventory.consumer.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  providers: [InventoryConsumer],
})
export class InventoryModule {}
