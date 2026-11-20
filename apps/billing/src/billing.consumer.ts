import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseSqsConsumer, OrderCreated } from '@app/messaging';

@Injectable()
export class BillingConsumer extends BaseSqsConsumer {
  constructor(config: ConfigService) {
    super(config, 'Billing', 'BILLING_QUEUE_URL');
  }

  protected async handle(order: OrderCreated) {
    if (order.customerEmail === 'fail@email.com') {
      throw new Error('Pagamento recusado (simulado)');
    }
    this.logger.log(`💳 Cobrança processada: ${order.orderId}`);
  }
}