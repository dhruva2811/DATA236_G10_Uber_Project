const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
  console.error('Kafka Producer error:', err);
});

const sendMessage = (topic, message) => {
  const payloads = [
    { topic, messages: JSON.stringify(message), partition: 0 }
  ];
  producer.send(payloads, (err, data) => {
    if (err) console.error('Error sending message to Kafka:', err);
    else console.log(`Kafka → Topic [${topic}] sent:`, message);
  });
};

module.exports = sendMessage;
