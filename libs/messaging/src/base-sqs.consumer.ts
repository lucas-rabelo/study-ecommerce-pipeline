import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';

export interface OrderCreated {
  eventId: string;
  orderId: string;
  createdAt: string;
  customerEmail: string;
  items: { sku: string; qty: number }[];
}

export abstract class BaseSqsConsumer implements OnModuleInit, OnModuleDestroy {
  protected readonly logger: Logger;
  private consumer: Consumer;

  protected constructor(
    private readonly config: ConfigService,
    name: string,
    private readonly queueUrlEnv: string,
  ) {
    this.logger = new Logger(name);
  }

  protected abstract handle(payload: any, eventType: string, attempt: number): Promise<void>;

  onModuleInit() {
    this.consumer = Consumer.create({
      queueUrl: this.config.getOrThrow(this.queueUrlEnv),
      sqs: new SQSClient({
        region: this.config.getOrThrow('AWS_REGION'),
        endpoint: this.config.get('AWS_ENDPOINT'),
      }),
      waitTimeSeconds: 20,
      messageSystemAttributeNames: ['ApproximateReceiveCount'],
      messageAttributeNames: ['All'],
      handleMessage: async (message) => {
        const payload = JSON.parse(message.Body!); // um parse só
        const eventType = message.MessageAttributes?.eventType?.StringValue ?? 'unknown';
        const attempt = Number(message.Attributes?.ApproximateReceiveCount ?? 1);

        this.logger.log(`Tentativa ${attempt} | ${eventType}`);
        await this.handle(payload, eventType, attempt);
        return message;
      }
    });

    this.consumer.on('error', (err) => this.logger.error(err.message));
    this.consumer.on('processing_error', (err) => this.logger.error(`Falha: ${err.message}`));
    this.consumer.start();
    this.logger.log('Worker ouvindo a fila...');
  }

  onModuleDestroy() {
    this.consumer.stop();
  }
}