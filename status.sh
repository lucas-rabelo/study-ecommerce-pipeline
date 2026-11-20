#!/bin/bash
QUEUE=${1:?Uso: ./scripts/status.sh <nome-da-fila, ex: billing-queue ou billing-dlq>}

docker compose exec localstack awslocal sqs get-queue-attributes \
  --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/${QUEUE} \
  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible