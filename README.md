# Seasonal Veggies

Seasonal Veggies is an npm-workspaces monorepo with independently runnable and deployable frontend and backend applications.

## Projects

- `apps/seasonal-veggies-fe` — React, Vite, and the existing component gallery and tests.
- `apps/seasonal-veggies-be` — NestJS API starter with a health endpoint at `/api/health`.

## Install and run

Install dependencies from the repository root:

```sh
npm install
```

Run each app in a separate terminal:

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

The backend health endpoint is available at `http://localhost:3000/api/health`. The frontend still uses its existing local crop data; connecting it to the API can be done separately without coupling the two deployment artifacts.

## Frontend tests and coverage

Install Playwright's Chromium browser once with `npx playwright install chromium`, then run component tests with `npm run test:components`. Component stories live beside their source components as `*.story.tsx` files and are served by the gallery at `/playwright/gallery/index.html`.

Run `npm test` (or `npm run coverage --workspace=@seasonal-veggies/fe`) to run the Vitest unit tests and both Playwright projects and generate a combined LCOV report at `apps/seasonal-veggies-fe/coverage/lcov.info`.
