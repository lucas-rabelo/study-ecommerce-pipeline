#!/bin/bash
set -e

REGION=us-east-1
TOPIC_ARN=arn:aws:sns:$REGION:000000000000:order-events

awslocal sns create-topic --name order-events

for SERVICE in billing inventory notifications; do
  awslocal sqs create-queue --queue-name ${SERVICE}-queue

  awslocal sns subscribe \
    --topic-arn $TOPIC_ARN \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:$REGION:000000000000:${SERVICE}-queue
done

echo "✅ SNS + SQS prontos"