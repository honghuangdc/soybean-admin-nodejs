import { ConfigType, registerAs } from '@nestjs/config';

import { getEnvNumber, getEnvString } from '@lib/utils/env';

export const redisRegToken = 'redis';

export const RedisConfig = registerAs(redisRegToken, () => {
  return {
    mode: process.env.REDIS_MODE ?? 'standalone', // 'standalone', 'cluster', 'sentinel'
    standalone: {
      host: getEnvString('REDIS_HOST', 'localhost'),
      port: getEnvNumber('REDIS_PORT', 26379),
      password: getEnvString('REDIS_PASSWORD', '123456'),
      db: getEnvNumber('REDIS_DB', 5),
    },
    cluster: process.env.REDIS_CLUSTER_NODES
      ? process.env.REDIS_CLUSTER_NODES.split(',').map((node) => {
          const [host, port] = node.split(':');
          return {
            host,
            port: parseInt(port, 10),
            password: getEnvString('REDIS_CLUSTER_PASSWORD', ''),
          };
        })
      : [],
    sentinel: {
      sentinels: process.env.REDIS_SENTINELS
        ? process.env.REDIS_SENTINELS.split(',').map((node) => {
            const [host, port] = node.split(':');
            return { host, port: parseInt(port, 10) };
          })
        : [],
      name: getEnvString('REDIS_SENTINEL_MASTER_NAME', 'master'),
      password: getEnvString('REDIS_SENTINEL_PASSWORD', ''),
      db: getEnvNumber('REDIS_SENTINEL_DB', 5),
    },
  };
});

export type IRedisConfig = ConfigType<typeof RedisConfig>;
