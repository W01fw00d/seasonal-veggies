FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/seasonal-veggies-fe/package.json apps/seasonal-veggies-fe/package.json
COPY apps/seasonal-veggies-be/package.json apps/seasonal-veggies-be/package.json
RUN npm ci --workspace=@seasonal-veggies/fe --include-workspace-root=false

COPY apps/seasonal-veggies-fe apps/seasonal-veggies-fe
RUN npm run build --workspace=@seasonal-veggies/fe

FROM nginx:alpine AS runtime

COPY apps/seasonal-veggies-fe/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/seasonal-veggies-fe/dist /usr/share/nginx/html

EXPOSE 80
