import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

import { RedisUtility } from '@lib/shared/redis/redis.util';

@Injectable()
export class AppService {
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
    const redisClient = RedisUtility.instance;
    const info = await redisClient.info();
    const redisInfo: any = {};
    const lines = info.split('\r\n');
    lines.forEach((line) => {
      if (line && !line.startsWith('#')) {
        const parts = line.split(':');
        if (parts.length > 1) {
          redisInfo[parts[0]] = parts[1];
        }
      }
    });
    return redisInfo;
  }
}
