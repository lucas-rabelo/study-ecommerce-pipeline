import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor(config: ConfigService) {
    this.client = new SNSClient({
      region: config.getOrThrow('AWS_REGION'),
      endpoint: config.get('AWS_ENDPOINT'),
    });
    this.topicArn = config.getOrThrow('ORDER_TOPIC_ARN');
  }

  async publish(eventType: string, payload: unknown) {
    const result = await this.client.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(payload),
        MessageAttributes: {
          eventType: { DataType: 'String', StringValue: eventType },
        },
      }),
    );
    return result.MessageId;
  }
}
