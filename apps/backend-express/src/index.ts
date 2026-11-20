import express from 'express'
import { booksRouter } from './books.js'

const port = Number(process.env.PORT ?? 3000)

const app = express()

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/books', booksRouter)

const server = app.listen(port, () => {
  console.log(`backend-express listening on :${port}`)
})

// Graceful shutdown: stop accepting connections, let in-flight requests finish.
// Later increments will flush telemetry here before exiting.
function shutdown(signal: NodeJS.Signals) {
  console.log(`received ${signal}, shutting down`)
  server.close((error) => {
    process.exit(error ? 1 : 0)
  })
  server.closeIdleConnections()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
