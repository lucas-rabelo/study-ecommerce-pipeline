import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';

export interface OrderCreated {
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

  /** Regra de negócio: lance exceção para NÃO confirmar a mensagem. */
  protected abstract handle(order: OrderCreated, attempt: number): Promise<void>;

  onModuleInit() {
    this.consumer = Consumer.create({
      queueUrl: this.config.getOrThrow(this.queueUrlEnv),
      sqs: new SQSClient({
        region: this.config.getOrThrow('AWS_REGION'),
        endpoint: this.config.get('AWS_ENDPOINT'),
      }),
      waitTimeSeconds: 20,
      messageSystemAttributeNames: ['ApproximateReceiveCount'],
      handleMessage: async (message) => {
        const envelope = JSON.parse(message.Body!);
        const order: OrderCreated = JSON.parse(envelope.Message);
        const attempt = Number(message.Attributes?.ApproximateReceiveCount ?? 1);

        this.logger.log(`Tentativa ${attempt} | pedido ${order.orderId}`);
        await this.handle(order, attempt);
        return message; // ack: só chega aqui se handle() não lançou erro
      },
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