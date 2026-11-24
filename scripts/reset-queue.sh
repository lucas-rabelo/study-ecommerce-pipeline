for Q in billing inventory notifications; 
  do   
    docker compose exec localstack awslocal sqs purge-queue --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/${Q}-queue;
  done