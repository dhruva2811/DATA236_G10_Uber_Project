const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new kafka.Consumer(
  client,
  [{ topic: 'ride-requested', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('📩 Kafka Message received:');
  console.log(JSON.parse(message.value));
});

consumer.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});
