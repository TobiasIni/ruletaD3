# Dockerfile para aplicación de ruleta con Next.js
# Multi-stage build para optimizar el tamaño de la imagen

# Etapa 1: Base con Node.js
FROM node:18-alpine AS base

# Instalar dependencias necesarias para node-gyp
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Etapa 2: Instalar dependencias
FROM base AS deps
# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
# Instalar dependencias
RUN npm ci --only=production

# Etapa 3: Build de la aplicación
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED 1

# Construir la aplicación
RUN npm run build

# Etapa 4: Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Crear directorio .next con permisos correctos
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar archivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
