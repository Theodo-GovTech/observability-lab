import { pino } from 'pino'

// Browser build of pino: structured objects in the devtools console, using the
// same field schema as the backend. Base attributes are set through a child
// binding because the browser build does not apply `base`.
export const logger = pino({
  level: import.meta.env.VITE_LOG_LEVEL ?? (import.meta.env.DEV ? 'debug' : 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
  // Errors become plain {type, msg, stack} objects instead of Error instances.
  serializers: { err: pino.stdSerializers.err },
  browser: {
    asObject: true,
    serialize: true,
    formatters: {
      level: (label) => ({ level: label }),
    },
  },
}).child({
  'service.name': 'frontend-react',
  'deployment.environment': import.meta.env.MODE,
})
