import { pino } from 'pino'

// Structured JSON logs on stdout. Field names follow OpenTelemetry resource
// conventions (service.name, deployment.environment) so they map cleanly once
// logs are shipped to the LGTM stack.
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    'service.name': 'backend-express',
    'deployment.environment': process.env.NODE_ENV ?? 'development',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
})
