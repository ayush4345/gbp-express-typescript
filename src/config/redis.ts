import { createClient } from 'redis';
import { AppConfig } from '../types/index.js';

export async function getRedisConnection(config: AppConfig) {
  const client = createClient({
    socket: {
      host: config.redis_addr.split(':')[0],
      port: parseInt(config.redis_addr.split(':')[1], 10),
    },
    password: config.redis_pwd || undefined,
    database: config.redis_db,
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();
  console.log('Redis connected successfully');

  return client;
}
