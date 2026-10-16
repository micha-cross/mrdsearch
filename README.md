# mrdsearch

A simple product search app.

## Getting started

Install dependencies for both apps:

```sh
cd api && npm install
cd ../client && npm install
```

Run both in development (two terminals):

```sh
cd api && npm run dev       # http://localhost:3000 (tsx watch, auto-reload)
cd client && npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:3000`, so the client calls
`fetch('/api/...')` without CORS setup. The starter page shows whether `/api/health` responds.

## Scripts

| | `api/` | `client/` |
|---|---|---|
| `npm run dev` | Start with auto-reload | Start Vite dev server |
| `npm run build` | Compile TS to `dist/` | Build to `dist/` |
| `npm start` / `npm run preview` | Run compiled server | Serve the production build |
| `npm run check` | Type-check | Type-check (svelte-check) |

The API port can be changed with the `PORT` environment variable.

Browser requests are only accepted from the origins in `ALLOWED_ORIGINS`, a comma-separated
list that defaults to `http://localhost:5173`. Other origins get a `403`; requests with no
`Origin` header (curl, server-to-server) are allowed.

```sh
ALLOWED_ORIGINS=http://localhost:5173,https://mrdsearch.example.com npm run dev
```
