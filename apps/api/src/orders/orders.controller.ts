import { Body, Controller, Param, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SnsService } from '../sns/sns.service.js';
import type { OrderCreated } from '@app/messaging';

@Controller('orders')
export class OrdersController {
  constructor(private readonly sns: SnsService) {}

  @Post()
  async create(@Body() body: { customerEmail: string; items: { sku: string; qty: number }[] }) {
    const order: OrderCreated  = {
      eventId: randomUUID(),
      orderId: randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    };
    const messageId = await this.sns.publish('OrderCreated', order);
    return { orderId: order.orderId, messageId };
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    const messageId = await this.sns.publish('OrderCancelled', {
      eventId: randomUUID(),
      orderId: id,
      cancelledAt: new Date().toISOString(),
    });
    return { orderId: id, messageId };
  }
}
