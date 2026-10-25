# Seasonal Veggies

A React app that shows which fruits and vegetables are in season.

## Using the App

Press [d] to toggle dark mode.

## Component Tests

Install Playwright's Chromium browser once with `npx playwright install chromium`, then run the component tests with `npm run test:components`. Component stories live beside their source components as `*.story.tsx` files and are served by the gallery at `/playwright/gallery/index.html`.

## Test Coverage

Run `npm test` (or `npm run coverage`) to run the Vitest unit tests and both Playwright projects and generate a combined LCOV report at `coverage/lcov.info`, which can be read by editor's extensions to display the coverage inline.
