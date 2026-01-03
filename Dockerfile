# Stage 1: Dependências e build
FROM node:20-alpine AS deps

WORKDIR /app

# Instalar dependências do package.json
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copiar código da aplicação
COPY . .

# Build da aplicação
RUN npm run build

# Stage 3: Runner de Produção
FROM node:20-alpine AS runner

WORKDIR /app

# Instalar dependências de produção
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copiar build estático
COPY --from=builder --chown=node:node /app/.next/standalone ./

# Criar diretório de uploads
RUN mkdir -p /app/public/uploads/documentos /app/public/uploads/cartas

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:./db/custom.db

# Expor porta
EXPOSE 3000

# Iniciar aplicação
CMD ["node", "server.js"]
