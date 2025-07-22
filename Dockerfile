# Build-Phase
FROM node:20-alpine AS builder

# Benötigte Pakete für native Module
RUN apk add --no-cache \
  python3 \
  py3-pip \
  make \
  g++ \
  bash

WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren und App bauen
COPY . .
RUN npm run build

# Produktions-Phase
FROM node:20-alpine
WORKDIR /app

# Nur notwendige Dateien kopieren
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.svelte-kit ./svelte-kit
COPY --from=builder /app/src ./src
COPY --from=builder /app/static ./static
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/svelte.config.js ./

# Nur Produktions-Abhängigkeiten installieren
RUN npm install --omit=dev
EXPOSE 3000

CMD ["node", "build"]