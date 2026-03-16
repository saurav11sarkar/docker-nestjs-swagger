# ─────────────── Development ───────────────
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:dev"]


# ─────────────── Build ───────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --omit=dev


# ─────────────── Production ───────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/package*.json ./

USER appuser

EXPOSE 5000

CMD ["node", "dist/main.js"]