import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseSqsConsumer, OrderCreated } from '@app/messaging';

@Injectable()
export class InventoryConsumer extends BaseSqsConsumer {
  constructor(config: ConfigService) {
    super(config, 'Inventory', 'INVENTORY_QUEUE_URL');
  }

  protected async handle(order: OrderCreated) {
    if (order.items.some((i) => i.sku === 'OUT-OF-STOCK')) {
      throw new Error('Estoque insuficiente (simulado)');
    }
    this.logger.log(`📦 Estoque reservado: ${order.items.map((i) => `${i.sku}x${i.qty}`).join(', ')}`);
  }
}