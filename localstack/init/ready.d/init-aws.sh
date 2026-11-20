#!/bin/bash
set -e

REGION=us-east-1
TOPIC_ARN=arn:aws:sns:$REGION:000000000000:order-events

awslocal sns create-topic --name order-events

for SERVICE in billing inventory notifications; do
  # 1. DLQ primeiro (a fila principal precisa do ARN dela)
  awslocal sqs create-queue --queue-name ${SERVICE}-dlq
  DLQ_ARN=arn:aws:sqs:$REGION:000000000000:${SERVICE}-dlq

  # 2. Fila principal com RedrivePolicy
  ATTRS=$(cat <<EOF
{"VisibilityTimeout":"10","RedrivePolicy":"{\"deadLetterTargetArn\":\"$DLQ_ARN\",\"maxReceiveCount\":\"3\"}"}
EOF
)
  awslocal sqs create-queue --queue-name ${SERVICE}-queue --attributes "$ATTRS"

  # 3. Assinatura no tópico (igual à Etapa 1)
  awslocal sns subscribe \
    --topic-arn $TOPIC_ARN \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:$REGION:000000000000:${SERVICE}-queue
done

echo "✅ SNS + SQS + DLQs prontos"