import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SnsService } from '../sns/sns.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly sns: SnsService) {}

  @Post()
  async create(@Body() body: { customerEmail: string; items: { sku: string; qty: number }[] }) {
    const order = {
      orderId: randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    };
    const messageId = await this.sns.publish('OrderCreated', order);
    return { orderId: order.orderId, messageId };
  }
}
