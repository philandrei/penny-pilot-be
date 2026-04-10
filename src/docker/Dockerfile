# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# copy package files
COPY package*.json ./

# install deps
RUN npm ci

# copy source
COPY . .

# build project
RUN npm run build


# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

# copy only required files
COPY package*.json ./

RUN npm ci --omit=dev

# copy built app from builder
COPY --from=builder /app/dist ./dist

# Railway provides PORT env
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]