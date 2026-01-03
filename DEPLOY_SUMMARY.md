# 🎉 Deploy Facilitado - Sistema de Gestão de Documentos

## ✅ O que foi criado para tornar o deploy fácil

### 1. Scripts de Deploy Automatizados
**Novos scripts em package.json:**
- `npm run deploy:vercel` - Deploy para Vercel com um comando
- `npm run deploy:railway` - Deploy para Railway
- `npm run docker:build` - Construir imagem Docker
- `npm run docker:run` - Executar container Docker
- `npm run setup` - Setup inicial completo (instalar + preparar banco)
- `npm run clean` - Limpar cache e builds
- `npm run predeploy` - Preparar tudo para deploy

**Como usar:**
```bash
# Setup inicial
npm run setup

# Preparar e fazer deploy
npm run predeploy
npm run deploy:vercel
```

### 2. Arquivos de Configuração Criados

**Para Vercel:**
- `.vercel/` - Diretório de configuração do Vercel
- `vercel.json` - Configuração de build e rotas

**Para Railway:**
- `.railway/` - Diretório de configuração do Railway

**Para Docker:**
- `Dockerfile` - Imagem Docker otimizada para produção
- `docker-compose.yml` - Compose para desenvolvimento local e produção

**Para Variáveis de Ambiente:**
- `.env.example` - Modelo de todas as variáveis necessárias
- Cópia para `.env` e preencha os valores

### 3. Documentação Completa

**Arquivos de documentação:**
- `README.md` - Documentação completa do sistema com todas as funcionalidades
- `DEPLOYMENT.md` - Guia detalhado de deploy com múltiplos métodos
- `QUICK_DEPLOY.md` - Deploy rápido em 3 passos (vercel/railway/docker)

**Como usar:**
```bash
cat DEPLOYMENT.md   # Guia completo
cat QUICK_DEPLOY.md   # Deploy rápido
```

### 4. Scripts de Ajuda

**Script de ajuda:**
- `scripts/deploy-help.sh` - Ajuda interativa para todos os comandos
- Execute com: `npm run help` ou `bash scripts/deploy-help.sh`

**Comandos disponíveis:**
```bash
bash scripts/deploy-help.sh help          # Mostra ajuda completa
bash scripts/deploy-help.sh deploy-vercel # Ajuda para Vercel
bash scripts/deploy-help.sh deploy-railway # Ajuda para Railway
bash scripts/deploy-help.sh docker          # Ajuda para Docker
bash scripts/deploy-help.sh setup          # Ajuda para setup
bash scripts/deploy-help.sh clean          # Ajuda para limpar
```

### 5. .gitignore Atualizado

**Entradas adicionadas:**
- `public/uploads/*` - Ignorar uploads locais
- `!public/uploads/.gitkeep` - Mas manter o arquivo .gitkeep
- `db/*.db` - Ignorar arquivos de banco locais
- `.cache` - Ignorar caches adicionais

---

## 🚀 Como Fazer Deploy em 5 Minutos

### MÉTODO 1: Vercel (Mais Fácil) ⭐

**Passo 1:** Instalar Vercel CLI
```bash
npm i -g vercel
```

**Passo 2:** Deploy inicial
```bash
npm run deploy:vercel
```

**Passo 3:** Configurar variáveis
- Aceda a vercel.com
- Vá ao projeto > Settings > Environment Variables
- Adicione: `DATABASE_URL=file:./db/custom.db`

**Passo 4:** Deploy automático
```bash
git push origin main
# Deploy automático!
```

**PRONTO!** 🎉
- Aplicação online em segundos
- URL: `https://seu-projeto.vercel.app`
- HTTPS automático
- Escalamento automático

---

### MÉTODO 2: Railway (Mais Fácil Depois de Vercel) 🚂

**Passo 1:** Aceder a railway.app
**Passo 2:** "New Project"
**Passo 3:** "Deploy from GitHub repo"
**Passo 4:** Selecionar este repositório
**Passo 5:** Railway detecta Next.js automaticamente
**Passo 6:** "Deploy"

**PRONTO!** 🎉
- Aplicação online automaticamente
- URL: `https://seu-projeto.railway.app`
- Banco PostgreSQL grátis
- Deploy via Git push automático

---

### MÉTODO 3: Docker (Universal) 🐳

**Passo 1:** Build
```bash
npm run docker:build
```

**Passo 2:** Testar local
```bash
npm run docker:run
# Aceda a http://localhost:3000
```

**Passo 3:** Push para registry
```bash
docker tag sistema-gestao-docs:latest ghcr.io/seu-usuario/sistema-gestao-docs:latest
docker push ghcr.io/seu-usuario/sistema-gestao-docs:latest
```

**Passo 4:** Executar em produção
```bash
docker run -d -p 3000:3000 --name docs-app \
  -v /var/www/uploads:/app/public/uploads \
  ghcr.io/seu-usuario/sistema-gestao-docs:latest
```

**PRONTO!** 🎉
- Funciona em qualquer servidor com Docker
- Isolamento completo
- Volume persistente para uploads e banco

---

## 🎯 Funcionalidades Disponíveis Após Deploy

### ✅ Uploads de Documentos
- **Frente** do documento (BI, Passaporte, Cartão de Cidadão)
- **Verso** do documento
- **Fotografia** do utilizador (selfie)
- Pré-visualização antes de guardar
- Indicadores visuais de sucesso

### ✅ Cartas de Condução
- Upload de frente, verso e fotografia
- Substituição automática de fotos
- Dados completos (número, categoria, validade, etc.)

### ✅ Assistente Jurídico
- Chat com IA especializado em direito português
- Geração de templates jurídicos
- Sugestões de melhorias
- Salvar como template reutilizável

### ✅ Auto-Cura Inteligente
- Monitorização de erros em tempo real
- Análise com LLM de todos os problemas
- Sugestões de correções automáticas
- Aplicação de correções com um clique

### ✅ Gestão de Ativos
- Cadastro de veículos e equipamentos
- Valores de aluguer (diário, semanal, mensal)
- Upload de fotos dos ativos

### ✅ Gestão de Utilizadores
- CRUD completo de utilizadores
- Sistema de papéis/roles
- Permissões personalizadas

---

## 📋 Checklists de Deploy

### Pré-Deploy ✅
- [x] Scripts de deploy criados
- [x] Dockerfile criado
- [x] docker-compose.yml criado
- [x] Documentação completa
- [x] .env.example criado
- [x] .gitignore atualizado
- [x] Vercel config criada
- [x] Railway config criada

### Para Fazer 📝
- [ ] Criar conta no Vercel
- [ ] Criar conta no Railway
- [ ] Configurar variáveis de ambiente
- [ ] Fazer primeiro deploy
- [ ] Testar funcionalidades em produção
- [ ] Configurar domínio personalizado (opcional)

---

## 🔧 Troubleshooting Rápido

### Erro: Deploy Falha
```bash
npm run clean
npm run build
npm run deploy:vercel
```

### Erro: Database Not Found
```bash
npm run db:push
# Configure DATABASE_URL no .env ou na plataforma de deploy
```

### Erro: Uploads Não Funcionam
```bash
# Verificar se diretórios existem
mkdir -p public/uploads/documentos public/uploads/cartas

# Verificar permissões
chmod -R 755 public/uploads
```

### Erro: TypeScript Errors
```bash
npm run type-check
npm run lint
```

---

## 📞 Suporte e Documentação

### Documentação Disponível
- `README.md` - Guia completo do sistema
- `DEPLOYMENT.md` - Guia detalhado de deploy
- `QUICK_DEPLOY.md` - Deploy rápido em 3 passos

### Links Úteis
- [Next.js Production](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)

### Comandos de Ajuda
```bash
npm run help              # Ver todos os comandos disponíveis
bash scripts/deploy-help.sh help  # Ajuda interativa
```

---

## 🎊 Sucesso!

**Agora é MUITO FÁCIL fazer deploy!** 🚀

### Por que ficou fácil:
1. ✅ Scripts de deploy em um comando
2. ✅ Múltiplas plataformas (Vercel, Railway, Docker)
3. ✅ Documentação completa
4. ✅ Setup inicial automatizado
5. ✅ Ajuda interativa disponível

### Para fazer deploy agora:
```bash
# MÉTODO 1: Vercel (Recomendado)
npm run setup
npm run deploy:vercel

# MÉTODO 2: Railway
npm run setup
# Depois, aceda a railway.app e clique em "Deploy from GitHub"

# MÉTODO 3: Docker
npm run setup
npm run docker:build
npm run docker:run
```

**Deploy feito em menos de 5 minutos!** ⏱️

---

**Versão:** 1.0.0
**Data:** 2024
**Stack:** Next.js + TypeScript + Prisma + SQLite + Docker + Vercel + Railway
