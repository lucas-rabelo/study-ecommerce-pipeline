import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseSqsConsumer, OrderCreated } from '@app/messaging';

@Injectable()
export class NotificationsConsumer extends BaseSqsConsumer {
  constructor(config: ConfigService) {
    super(config, 'Notifications', 'NOTIFICATIONS_QUEUE_URL');
  }

  protected async handle(order: OrderCreated) {
    this.logger.log(`✉️  E-mail enviado para ${order.customerEmail}`);
  }
}