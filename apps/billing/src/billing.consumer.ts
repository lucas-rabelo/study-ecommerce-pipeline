import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseSqsConsumer, IdempotencyStore, OrderCreated } from '@app/messaging';

@Injectable()
export class BillingConsumer extends BaseSqsConsumer {
  private readonly idempotencyStore = new IdempotencyStore();

  constructor(config: ConfigService) {
    super(config, 'Billing', 'BILLING_QUEUE_URL');
  }

  protected async handle(order: OrderCreated) {
    const key = `billing:${order.eventId}`;
    if (!this.idempotencyStore.tryAcquire(key)) {
      this.logger.warn(`⏭️  Duplicada, ignorando ${order.eventId}`);
      return; // retorna sem erro => a mensagem é confirmada e deletada
    }

    try {
      if (order.customerEmail === 'fail@email.com') {
        throw new Error('Pagamento recusado (simulado)');
      }
      this.logger.log(`💳 Cobrança processada: ${order.orderId}`);
    } catch (err) {
      this.idempotencyStore.release(key); // falhou: libera para a próxima tentativa
      throw err;
    }
  }
}