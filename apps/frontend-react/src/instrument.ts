import * as Sentry from '@sentry/react'

// Must be imported before anything else in main.tsx so the SDK is initialized
// before the app code runs. Without VITE_SENTRY_DSN the SDK stays disabled.
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    // pino's browser build writes to the console, so this forwards app logs.
    Sentry.consoleLoggingIntegration({ levels: ['info', 'warn', 'error'] }),
  ],
  // Sample every trace locally, 10% in production.
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  // Same-origin API calls (/api/*) carry trace headers to the backend.
  tracePropagationTargets: [/^\//],
  replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
})
