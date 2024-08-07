import * as os from 'os';

import { Injectable } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';
import * as si from 'systeminformation';

import { RedisUtility } from './shared/redis/services/redis.util';

@Injectable()
export class AppService {
  private redisClient: Redis | Cluster = RedisUtility.instance;

  getHello(): string {
    return 'Hello World!';
  }

  async getSystemInfo() {
    const [
      cpu,
      memory,
      osInfo,
      currentLoad,
      disk,
      networkInterfaces,
      networkStats,
    ] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.currentLoad(),
      si.fsSize(),
      si.networkInterfaces(),
      si.networkStats('*'),
    ]);
    const nodeInfo = {
      nodeVersion: process.version,
      npmVersion: await si.versions('npm'),
    };

    const interfacesArray = Array.isArray(networkInterfaces)
      ? networkInterfaces
      : [networkInterfaces];

    return {
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        physicalCores: cpu.physicalCores,
        model: cpu.model,
        speed: cpu.speed,
        rawCurrentLoad: currentLoad.rawCurrentLoad,
        rawCurrentLoadIdle: currentLoad.rawCurrentLoadIdle,
        coresLoad: currentLoad.cpus.map((e) => {
          return {
            rawLoad: e.rawLoad,
            rawLoadIdle: e.rawLoadIdle,
          };
        }),
      },
      memory: {
        total: memory.total,
        free: memory.free,
        used: memory.used,
        available: memory.available,
      },
      disk: disk.map((d) => ({
        fs: d.fs,
        type: d.type,
        size: d.size,
        used: d.used,
        use: d.use,
      })),
      os: osInfo,
      nodeInfo,
      network: {
        interfaces: interfacesArray.map((iface) => ({
          name: iface.iface,
          ip4: iface.ip4,
          ip6: iface.ip6,
          mac: iface.mac,
        })),
        stats: networkStats,
      },
      data: await si.getAllData(),
    };
  }

  async getRedisInfo() {
    const info = await this.redisClient.info();
    const stats: { [key: string]: string } = {};
    info.split(/\r?\n/).forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        stats[parts[0]] = parts.slice(1).join(':');
      }
    });

    const keys = await this.redisClient.keys('*');
    const keyspaceCount = keys.length;

    return {
      version: stats['redis_version'],
      uptime: stats['uptime_in_seconds'],
      connectedClients: stats['connected_clients'],
      memoryUsed: stats['used_memory'],
      memoryHuman: stats['used_memory_human'],
      totalMemory: stats['total_system_memory_human'],
      keyspace: keyspaceCount,
    };
  }
}
