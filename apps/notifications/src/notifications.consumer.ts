import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseSqsConsumer, OrderCreated } from '@app/messaging';

@Injectable()
export class NotificationsConsumer extends BaseSqsConsumer {
  constructor(config: ConfigService) {
    super(config, 'Notifications', 'NOTIFICATIONS_QUEUE_URL');
  }

  protected async handle(payload: any, eventType: string) {
    if (eventType === 'OrderCancelled') {
      this.logger.log(`❌ Pedido ${payload.orderId} cancelado, cliente avisado`);
      return;
    }
    this.logger.log(`✉️  E-mail enviado para ${payload.customerEmail}`);
  }
}