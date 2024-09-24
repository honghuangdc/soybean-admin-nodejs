import { Redis, Cluster } from 'ioredis';

import { RedisConfig } from '@lib/config/redis.config';

export class RedisUtility {
  static get instance(): Redis | Cluster {
    return this._instance;
  }
  private static _instance: Redis | Cluster;
  private static initializing: Promise<Redis | Cluster> | null = null;

  private static async createInstance(): Promise<Redis | Cluster> {
    const [config] = await Promise.all([RedisConfig()]);
    if (config.mode === 'cluster') {
      this._instance = new Redis.Cluster(
        config.cluster.map((node) => ({
          host: node.host,
          port: node.port,
          password: node.password,
        })),
        {
          redisOptions: {
            password: config.cluster[0].password,
            db: config.standalone.db,
          },
        },
      );
    } else {
      this._instance = new Redis({
        host: config.standalone.host,
        port: config.standalone.port,
        password: config.standalone.password,
        db: config.standalone.db,
      });
    }
    return this._instance;
  }

  public static async client(): Promise<Redis | Cluster> {
    if (!this._instance) {
      if (!this.initializing) {
        this.initializing = this.createInstance();
      }
      this._instance = await this.initializing;
      this.initializing = null;
    }
    return this._instance;
  }
}
