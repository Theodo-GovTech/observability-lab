import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { pinoHttp } from 'pino-http'
import { logger } from './logger.js'

// One "request completed" line per request, correlated by a request ID that is
// taken from an incoming X-Request-Id header or generated, and echoed back.
export const httpLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const incoming = req.headers['x-request-id']
    const id = typeof incoming === 'string' && incoming !== '' ? incoming : randomUUID()
    res.setHeader('X-Request-Id', id)
    return id
  },
  // The compose healthcheck hits /health every 10s; keep it out of the logs.
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    return 'info'
  },
  serializers: {
    req: (req: IncomingMessage & { id?: unknown; remoteAddress?: string }) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      user_agent: req.headers['user-agent'],
      remote_address: req.remoteAddress,
    }),
    res: (res: ServerResponse) => ({
      status_code: res.statusCode,
    }),
  },
})
