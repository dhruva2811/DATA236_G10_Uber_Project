//updated
const redis = require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Redis client connected'));

client.connect(); 

module.exports = client;
