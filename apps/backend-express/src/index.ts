import express, { type ErrorRequestHandler } from 'express'
import { booksRouter } from './books.js'
import { httpLogger } from './http-logger.js'
import { logger } from './logger.js'

const port = Number(process.env.PORT ?? 3000)

const app = express()

app.use(httpLogger)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/books', booksRouter)

// Logs unhandled route errors with the request context and answers a generic 500.
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  req.log.error({ err }, 'unhandled request error')
  if (res.headersSent) {
    next(err)
    return
  }
  res.status(500).json({ error: 'Internal Server Error' })
}
app.use(errorHandler)

const server = app.listen(port, () => {
  logger.info({ port }, 'server listening')
})

// Graceful shutdown: stop accepting connections, let in-flight requests finish,
// then flush telemetry before exiting.
function shutdown(signal: NodeJS.Signals) {
  logger.info({ signal }, 'shutting down')
  server.close((error) => {
    if (error) logger.error({ err: error }, 'error while closing server')
    logger.flush()
    process.exit(error ? 1 : 0)
  })
  server.closeIdleConnections()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

function crash(err: unknown, origin: string) {
  logger.fatal({ err, origin }, 'process crashed')
  logger.flush()
  process.exit(1)
}

process.on('uncaughtException', (err) => crash(err, 'uncaughtException'))
process.on('unhandledRejection', (reason) => crash(reason, 'unhandledRejection'))
