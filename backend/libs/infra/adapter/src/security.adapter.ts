import fastifyHelmet from '@fastify/helmet';
import type {
  FastifyHelmetOptions,
  FastifyHelmetOptions as HelmetOptions,
} from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

/**
 * Referrer Policy 的可能值
 */
type ReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

type ContentSecurityPolicyValue = string | string[];

/**
 * 默认的 CSP 配置
 * @description Content Security Policy 配置，用于防止 XSS 攻击
 */
const defaultCSPDirectives = {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  connectSrc: ["'self'", 'https:', 'wss:'],
  fontSrc: ["'self'", 'data:', 'https:'],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'self'"],
} as const;

/**
 * 默认的 HSTS 配置
 * @description HTTP Strict Transport Security 配置，强制使用 HTTPS
 */
const defaultHSTSConfig = {
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
} as const;

/**
 * Helmet 中间件配置接口
 */
type HelmetConfig = Partial<{
  /**
   * CSP 配置
   * @default defaultCSPDirectives
   */
  contentSecurityPolicy: HelmetOptions['contentSecurityPolicy'];
  /**
   * 是否启用 XSS 过滤
   * @default true
   */
  xssFilter: boolean;
  /**
   * 是否禁止 MIME 类型嗅探
   * @default true
   */
  noSniff: boolean;
  /**
   * HSTS 配置
   * @default defaultHSTSConfig
   */
  strictTransportSecurity: typeof defaultHSTSConfig;
  /**
   * 引用策略
   * @default 'strict-origin-when-cross-origin'
   */
  referrerPolicy: {
    policy: ReferrerPolicy;
  };
  /**
   * 是否隐藏 X-Powered-By
   * @default true
   */
  hidePoweredBy: boolean;
}>;

/**
 * 注册 Helmet 安全中间件
 * @description 提供基本的安全防护，包括 XSS、CSP、HSTS 等
 * @param app Fastify 实例
 * @param config Helmet 配置
 * @example
 * ```typescript
 * // 使用默认配置
 * await registerHelmet(app);
 *
 * // 自定义配置
 * await registerHelmet(app, {
 *   contentSecurityPolicy: {
 *     directives: {
 *       defaultSrc: ["'self'"],
 *       scriptSrc: ["'self'", "'unsafe-inline'"]
 *     }
 *   }
 * });
 * ```
 */
export async function registerHelmet(
  app: FastifyInstance,
  config: HelmetConfig = {},
): Promise<void> {
  const helmetConfig: FastifyHelmetOptions = {
    contentSecurityPolicy: config.contentSecurityPolicy ?? {
      directives: defaultCSPDirectives,
    },
    xFrameOptions: {
      action: 'sameorigin',
    },
    xssFilter: config.xssFilter ?? true,
    noSniff: config.noSniff ?? true,
    strictTransportSecurity:
      config.strictTransportSecurity ?? defaultHSTSConfig,
    referrerPolicy: config.referrerPolicy ?? {
      policy: 'strict-origin-when-cross-origin',
    },
    hidePoweredBy: config.hidePoweredBy ?? true,
  };

  await app.register(fastifyHelmet, helmetConfig);
}
