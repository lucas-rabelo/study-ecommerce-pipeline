import { Module } from '@nestjs/common';
import { InventoryConsumer } from './inventory.consumer.js';

@Module({
  providers: [InventoryConsumer],
})
export class InventoryModule {}
