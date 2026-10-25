FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/seasonal-veggies-fe/package.json apps/seasonal-veggies-fe/package.json
COPY apps/seasonal-veggies-be/package.json apps/seasonal-veggies-be/package.json
RUN npm ci --workspace=@seasonal-veggies/be --include-workspace-root=false

COPY apps/seasonal-veggies-be apps/seasonal-veggies-be
RUN npm run build --workspace=@seasonal-veggies/be

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/seasonal-veggies-fe/package.json apps/seasonal-veggies-fe/package.json
COPY apps/seasonal-veggies-be/package.json apps/seasonal-veggies-be/package.json
RUN npm ci --omit=dev --workspace=@seasonal-veggies/be --include-workspace-root=false

COPY --from=build /app/apps/seasonal-veggies-be/dist apps/seasonal-veggies-be/dist

EXPOSE 3000
CMD ["node", "apps/seasonal-veggies-be/dist/main.js"]
