# Observability Lab

Observability guild's playground to mess around with tools, configs and app instrumentation.

The goal is a small, controlled app to practice with monitoring tools and compare their developer
experience and configuration tweaks. It is built in increments, starting from a **completely
uninstrumented baseline**.

## Architecture

```
browser ──► frontend-react (nginx :8080) ──/api/*──► backend-express (Node :3000)
              static Vite build                       GET /api/books (in-memory)
                                                      GET /health
```

| App | Stack | Notes |
|---|---|---|
| `apps/frontend-react` | React 19, TypeScript, Vite (`react-ts` template) | Production build served by nginx, which proxies `/api/` to the backend (same origin, no CORS) |
| `apps/backend-express` | Node 24, Express 5, TypeScript (ESM) | Single endpoint returning books from memory, graceful shutdown on `SIGTERM` |

Apps are named `(frontend|backend)-<stack>` so that equivalent apps in other stacks can be added
side by side to compare instrumentation across languages.

[Bun](https://bun.sh) is used as the **package manager** only; the backend runs on Node.

## Run with Docker

```sh
docker compose up --build
```

- App: http://localhost:8080
- Backend directly: http://localhost:3000/api/books

## Develop on the host

Requires Bun and Node 24 (see `.nvmrc`).

```sh
cd apps/backend-express && bun install && bun run dev   # http://localhost:3000
cd apps/frontend-react  && bun install && bun run dev   # http://localhost:5173, proxies /api to :3000
```
