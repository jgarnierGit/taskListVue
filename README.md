# Task List

using frontend : Vue3, Nuxt3, Vuetify, Vitest and PlayWright

using backend : python3, FastAPI, pytest

## Setup

Make sure to install the dependencies:

Docker, npm

## Dev

Start the development backend on `http://localhost:5000`:

```bash
> /
docker compose up dev
```
add `--build` option if compose config changed

launch and attach `debugpy` on `0.0.0.0:5678`

include `--wait-for-client` to debugpy if you need to debug from the start

Start the development server on `http://localhost:3000`:

```bash
> /services/frontend
npm run dev
```

## Debug from source remotely

listen to 0.0.0.0:5678

## tests

see [backend](./services/backend/README.md)

see [fronted](./services/frontend/README.md)

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.