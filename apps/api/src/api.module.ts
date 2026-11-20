import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders/orders.controller.js';
import { SnsService } from './sns/sns.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [OrdersController],
  providers: [SnsService],
})
export class ApiModule {}