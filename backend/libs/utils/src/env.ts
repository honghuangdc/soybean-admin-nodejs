import cluster from 'node:cluster';
import path from 'path';

export const isMainCluster =
  process.env.NODE_APP_INSTANCE === undefined ||
  Number.parseInt(process.env.NODE_APP_INSTANCE, 10) === 0;

export const isMainProcess = cluster.isPrimary || isMainCluster;

export const isDevEnvironment = process.env.NODE_ENV === 'development';

export const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  return value !== undefined ? value === 'true' : defaultValue;
};

export const getEnvString = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  return value ?? defaultValue;
};

export const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value) {
    const parsed = parseInt(value, 10);
    return !isNaN(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
};

export const getEnvArray = <T = string>(
  key: string,
  defaultValue: T[] = [],
): T[] => {
  const value = process.env[key];
  return value === undefined ? defaultValue : (value.split(',') as T[]);
};

export function getAppName(): string {
  if (!require.main) {
    return 'base-system'; // 默认值，以防无法确定
  }

  const mainPath = require.main.filename;
  const match = RegExp(/apps[/\\]([^/\\]+)/).exec(mainPath);
  return match ? match[1] : 'base-system';
}

export function getConfigPath(filename: string): string {
  const appName = getAppName();
  const basePath = process.cwd();
  const resourcePath = path.join('src', 'resources', filename);

  if (isDevEnvironment) {
    return path.join(basePath, 'apps', appName, resourcePath);
  } else {
    return path.join(basePath, 'dist', 'apps', appName, resourcePath);
  }
}
