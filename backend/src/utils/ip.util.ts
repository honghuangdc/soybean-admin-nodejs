import { IncomingMessage } from 'node:http';

import { FastifyRequest } from 'fastify';

export function getClientIpAndPort(request: FastifyRequest | IncomingMessage): {
  ip: string;
  port: number | null;
} {
  const headersToCheck = [
    'x-forwarded-for',
    'x-real-ip',
    'proxy-client-ip',
    'wl-proxy-client-ip',
    'http_client_ip',
    'http_x_forwarded_for',
  ];

  let ip: string | undefined;
  for (const header of headersToCheck) {
    const headerValue = request.headers[header] as string | undefined;
    if (headerValue) {
      ip = headerValue.split(',')[0].trim();
      if (ip) break;
    }
  }

  if (!ip && 'remoteAddress' in request.socket) {
    ip = request.socket.remoteAddress ?? undefined;
  }

  const port =
    'remotePort' in request.socket ? request.socket.remotePort : null;

  return { ip: ip ?? '', port: port ?? null };
}
