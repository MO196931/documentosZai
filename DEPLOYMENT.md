# 🚀 Deploy do Sistema de Gestão de Documentos

Guia completo para fazer deploy da aplicação em produção de forma rápida e fácil.

## 📋 Índice

- [🚀 Métodos de Deploy Rápidos](#-métodos-de-deploy-rápidos)
- [⚙️ Configuração Inicial](#-configuração-inicial)
- [📦 Métodos de Deploy Detalhados](#-métodos-de-deploy-detalhados)
- [🔧 Troubleshooting de Deploy](#-troubleshooting-de-deploy)

---

## 🚀 Métodos de Deploy Rápidos

### 1️⃣ Vercel (Recomendado - Mais Fácil) ⭐

**Vantagens:**
- ✅ Deploy em segundos (apenas `git push`)
- ✅ HTTPS automático
- ✅ Domínios personalizados gratuitos
- ✅ Escalamento automático
- ✅ Builds optimizados automaticamente
- ✅ Zero custo para projetos pessoais

**Comandos:**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer primeiro deploy
vercel --prod

# Depois, apenas git push e o deploy é automático
git push origin main
```

**Configuração de Variáveis no Vercel:**
```bash
# No dashboard do Vercel, adicionar estas variáveis:
DATABASE_URL=file:./db/custom.db
NODE_ENV=production
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

**Deploy Automático:**
```bash
# Usar o script que criamos
npm run deploy:vercel
```

---

### 2️⃣ Railway (Mais Fácil depois de Vercel) 🚂

**Vantagens:**
- ✅ Interface visual amigável
- ✅ Controle de todos os serviços
- ✅ Banco PostgreSQL gratuito
- ✅ Deploy via GitHub (automático)
- ✅ Preview URLs gratuitos

**Comandos:**
```bash
# 1. Conectar ao GitHub pelo Railway
# 2. Selecionar repositório
# 3. Railway detecta automaticamente (Next.js)

# Ou via CLI:
npm i -g @railway/cli
railway up
```

**Configuração no Railway:**
- Framework: Next.js
- Root Directory: `./`
- Install Command: `bun install && bun run db:generate`
- Start Command: `bun run start`
- Database: SQLite (ou PostgreSQL grátis)

**Deploy Automático:**
```bash
npm run deploy:railway
```

---

### 3️⃣ Docker (Universal) 🐳

**Vantagens:**
- ✅ Funciona em qualquer plataforma que suporte Docker
- ✅ Isolamento completo
- ✅ Fácil de testar localmente
- ✅ Controle total do ambiente

**Comandos:**
```bash
# 1. Construir imagem
npm run docker:build

# 2. Executar container
npm run docker:run

# 3. Em produção (com Docker Compose)
docker-compose up -d
```

**Docker Compose para Produção:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./db/custom.db
    volumes:
      - ./data:/app/public/uploads
      - ./db:/app/db
    restart: unless-stopped
```

---

### 4️⃣ AWS Amplify (Enterprise) ☁️

**Vantagens:**
- ✅ Escalamento automático
- ✅ CDN global da AWS
- ✅ Autenticação com Cognito
- ✅ Integração com outros serviços AWS

**Comandos:**
```bash
# Instalar Amplify CLI
npm i -g @aws-amplify/cli

# Configurar e deploy
amplify init
amplify add hosting
amplify publish
```

---

## ⚙️ Configuração Inicial

### Passo 1: Setup Rápido

```bash
# Clonar ou entrar no projeto
cd /home/z/my-project

# Instalar dependências
npm run setup

# Inicializar banco de dados
npm run db:push

# Verificar compilação
npm run type-check
```

### Passo 2: Configurar Variáveis de Ambiente

Copiar `.env.example` para `.env`:

```bash
cp .env.example .env
```

Editar `.env` com seus valores:

```env
DATABASE_URL=file:./db/custom.db
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

### Passo 3: Preparar para Deploy

```bash
# Limpar cache e build
npm run predeploy

# Verificar se tudo funciona
npm run build
npm start
```

---

## 📦 Métodos de Deploy Detalhados

### Deploy com Vercel (Completo)

```bash
# 1. Login no Vercel (primeira vez apenas)
vercel login

# 2. Vincular ao GitHub (opcional, mas recomendado)
# Acede ao settings do Vercel e conecta seu GitHub

# 3. Deploy inicial
vercel --prod

# O Vercel vai perguntar:
# - Scope: Qual conta? (selecionar ou criar)
# - Link to existing project?: No
# - Project name: sistema-gestao-documentos
# - Directory: ./

# 4. Configurar variáveis de ambiente
# Acede ao vercel.com > projeto > settings > environment variables
# Adicionar: DATABASE_URL=file:./db/custom.db
```

**Deploy Automático com Git:**
```bash
# Adicionar remote do Vercel
git remote add vercel https://vercel.com/seu-usuario/sistema-gestao-documentos.git

# Deploy com git push
git push vercel main

# Agora cada push faz deploy automático!
```

### Deploy com Railway (Completo)

```bash
# 1. Aceder a railway.app
# 2. Click em "New Project"
# 3. "Deploy from GitHub repo"
# 4. Selecionar o repositório
# 5. Railway detecta Next.js automaticamente
# 6. Click em "Deploy"

# Variáveis de ambiente no Railway:
# Settings > Variables > New Variable
# DATABASE_URL=file:./db/custom.db
# NODE_ENV=production
```

**Deploy Automático:**
- Conectar GitHub
- Habilitar "Automatic Deployments"
- Cada push faz deploy automático!

### Deploy com Docker

```bash
# 1. Fazer build da imagem
docker build -t sistema-gestao-docs:latest .

# 2. Testar localmente
docker run -p 3000:3000 --rm sistema-gestao-docs:latest

# 3. Tagar versão
docker tag sistema-gestao-docs:latest usuario/dockerhub:sistema-gestao-docs-v1

# 4. Push para Docker Hub (opcional)
docker push usuario/dockerhub:sistema-gestao-docs-v1

# 5. Usar em produção (VPS, AWS, etc.)
# No servidor de destino:
docker run -d -p 3000:3000 --name docs-app --restart unless-stopped \
  -v /var/www/uploads:/app/public/uploads \
  -v /var/www/db:/app/db \
  usuario/dockerhub:sistema-gestao-docs-v1

# Ou usar docker-compose:
docker-compose up -d
```

**Docker Registry Gratuito:**
```bash
# GitHub Container Registry (recomendado)
docker tag sistema-gestao-docs:latest ghcr.io/seu-usuario/sistema-gestao-docs:latest
docker push ghcr.io/seu-usuario/sistema-gestao-docs:latest

# GitLab Container Registry
docker tag sistema-gestao-docs:latest registry.gitlab.com/seu-usuario/sistema-gestao-docs:latest
docker push registry.gitlab.com/seu-usuario/sistema-gestao-docs:latest
```

---

## 🔧 Troubleshooting de Deploy

### Problema: Build Fails (Falha na build)

```bash
# Solução 1: Limpar cache e node_modules
npm run clean
rm -rf node_modules
npm install

# Solução 2: Verificar TypeScript
npm run type-check

# Solução 3: Verificar ESLint
npm run lint
```

### Problema: Database Not Found

```bash
# Solução: Inicializar banco antes do deploy
npm run db:push
npm run db:generate

# No deploy, verificar variável de ambiente:
# DATABASE_URL=file:./db/custom.db
```

### Problema: Uploads Não Funcionam

```bash
# Solução 1: Verificar permissões
mkdir -p public/uploads/documentos public/uploads/cartas
chmod -R 755 public/uploads

# Solução 2: Verificar variáveis de ambiente
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png
```

### Problema: API 404 ou 500

```bash
# Solução 1: Verificar rotas no vercel.json
# Verificar se as rotas da API estão configuradas corretamente

# Solução 2: Verificar logs de produção
# No Vercel: vercel.com > projeto > logs
# No Railway: railway.app > projeto > logs
```

### Problema: Slow Build (Construção Lenta)

```bash
# Solução: Otimizar .vercel.json
# Adicionar configurações para build mais rápido

# Solução 2: Usar cache
# No deploy, o cache deve ser utilizado automaticamente
```

---

## 📊 Monitoramento em Produção

### Logs em Vercel

```bash
# Ver logs em tempo real
vercel logs

# Ver logs de uma função específica
vercel logs --filter <function-name>
```

### Logs em Railway

```bash
# Via CLI
railway logs

# Via dashboard
# railway.app > projeto > logs
```

### Logs em Docker

```bash
# Ver logs do container
docker logs sistema-gestao-docs

# Seguir logs em tempo real
docker logs -f sistema-gestao-docs
```

---

## 🔄 CI/CD Automático

### Configuração GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🚀 Deploy Rápido em 3 Passos

### Opção A: Vercel (Recomendado) ⭐

```bash
# 1. Instalar CLI
npm i -g vercel

# 2. Deploy automático
vercel --prod

# PRONTO! Aplicação online em segundos.
```

### Opção B: Railway (Mais Fácil) 🚂

```bash
# 1. Aceder a railway.app
# 2. Conectar GitHub
# 3. Selecionar repositório
# 4. Click em "Deploy"

# PRONTO! Aplicação online.
```

### Opção C: Docker (Universal) 🐳

```bash
# 1. Construir e rodar
npm run docker:build
npm run docker:run

# PRONTO! Aplicação rodando em http://localhost:3000
```

---

## 📚 Documentação Útil

- [Next.js Production](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Docker Docs](https://docs.docker.com/)

---

## 💡 Dicas Pro

1. **Para Desenvolvimento:** Use `npm run dev`
2. **Para Testes de Build:** Use `npm run build`
3. **Para Verificar Tipos:** Use `npm run type-check`
4. **Para Testar Localmente:** Use `npm run docker:run`
5. **Para Deploy Rápido:** Use `npm run deploy:vercel`
6. **Para Limpar Tudo:** Use `npm run clean`

---

## 🎯 Checklists de Deploy

### Pré-Deploy:
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados inicializado
- [ ] Testes locais passando
- [ ] Build funciona sem erros
- [ ] `.gitignore` não inclui arquivos sensíveis
- [ ] README atualizado

### Pós-Deploy:
- [ ] URL de produção acessível
- [ ] Uploads funcionam
- [ ] API responde corretamente
- [ ] Autenticação funciona (se aplicável)
- [ ] Logs não mostram erros críticos
- [ ] Performance é aceitável

---

**Última atualização:** 2024
**Versão:** 1.0.0
**Stack:** Next.js 15 + TypeScript + Prisma + SQLite + Docker
