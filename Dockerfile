# syntax=docker/dockerfile:1

# базовый слой с зависимостями
FROM node:24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# локальная разработка
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# сборка продакшен-бандла
FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN npx nuxt prepare && npm run build

# продакшен
FROM node:24 AS prod
WORKDIR /app
ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000
COPY --from=build /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
