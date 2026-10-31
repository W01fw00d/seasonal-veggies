# Seasonal Veggies

Seasonal Veggies is an npm-workspaces monorepo with independently runnable and deployable frontend and backend applications.

## Projects

- `apps/seasonal-veggies-fe` — React, Vite, and the existing component gallery and tests.
- `apps/seasonal-veggies-be` — NestJS API with crop and health endpoints.

## Install and run

Install dependencies from the repository root:

```sh
npm install
```

Run each app in a separate terminal. The Vite development server proxies API requests to the backend:

```sh
npm run dev:fe
npm run dev:be
```

The frontend runs at `http://localhost:5173`; the backend listens on `http://localhost:3000`.

## Build and test

```sh
npm run build
npm run lint
npm test
```

`npm test` runs the frontend coverage suite. Frontend-specific commands are also available through npm workspaces, for example:

```sh
npm run test:components --workspace=@seasonal-veggies/fe
```

## Build and run Docker images independently

Run these commands from the repository root; each image is built from its own Dockerfile and can be deployed separately:

```sh
docker build -f apps/seasonal-veggies-fe/Dockerfile -t seasonal-veggies-fe .
docker run --rm -p 8080:80 seasonal-veggies-fe

docker build -f apps/seasonal-veggies-be/Dockerfile -t seasonal-veggies-be .
docker run --rm -p 3000:3000 seasonal-veggies-be
```

The backend endpoints are available at `http://localhost:3000/api/health` and `http://localhost:3000/api/crops`. Interactive API documentation is available at `http://localhost:3000/api/docs` (OpenAPI JSON: `/api/docs-json`). Crop data is currently served from an in-memory static dataset; no database is used.

The frontend requests `/api/crops` by default, and the Vite development server proxies it to `localhost:3000`. For separately hosted production apps, set `VITE_API_BASE_URL` to the backend origin when building the frontend and set `CORS_ORIGIN` on the backend to the frontend origin (or a comma-separated list of allowed origins).

## Frontend tests and coverage

Install Playwright's Chromium browser once with `npx playwright install chromium`, then run component tests with `npm run test:components`. Component stories live beside their source components as `*.story.tsx` files and are served by the gallery at `/playwright/gallery/index.html`.

Run `npm test` (or `npm run coverage --workspace=@seasonal-veggies/fe`) to run the Vitest unit tests and both Playwright projects and generate a combined LCOV report at `apps/seasonal-veggies-fe/coverage/lcov.info`.

Run the backend API and OpenAPI integration tests with `npm run test:be`.

The FE crop types are generated from the backend OpenAPI schema. After changing backend API contracts, run `npm run generate:api` from the repository root to regenerate `apps/seasonal-veggies-be/openapi.json` and `apps/seasonal-veggies-fe/src/api/types.gen.ts`.
