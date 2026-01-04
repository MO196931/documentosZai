# 🚀 Deploy Rápido - Sistema de Gestão de Documentos

## 🎯 Deploys Recomendados (Dois Clics!)

### ⭐ 1. Vercel (Mais Fácil)

**Por que Vercel?**
- Criadores do Next.js
- Deploy em segundos
- HTTPS automático
- Domínios grátis
- Preview URLs

**Como Deploy:**
```bash
# 1. Instalar Vercel (só primeira vez)
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy!
vercel --prod

# Pronto! Aplicação online em segundos.
```

### 🚂 2. Railway (Mais Fácil)

**Por que Railway?**
- Interface visual amigável
- Conexão automática com GitHub
- Deploy via dashboard (sem CLI!)
- Banco PostgreSQL grátis
- Preview URLs

**Como Deploy:**
```
1. Aceder a railway.app
2. Clicar em "New Project"
3. "Deploy from GitHub repo"
4. Selecionar este repositório
5. Railway detecta Next.js automaticamente
6. Clicar em "Deploy"

Pronto! Automático via git push.
```

---

## 🛠️ Troubleshooting (Problemas Comuns)

### Erro: Build Falha
```bash
npm run clean
rm -rf .next
npm run build
```

### Erro: Banco de Dados
```bash
# Resetar banco (cuidado - perde dados!)
npm run db:reset

# Apenas atualizar schema
npm run db:push
```

### Erro: Permissões
```bash
# Linux/Mac
chmod -R 755 public/uploads

# Windows (PowerShell)
icacls . /grant Everyone:(OI)(CI)F
```

### Erro: Timeout no Deploy
```bash
# Vercel: Verificar logs no dashboard
# Railway: Verificar logs na aba "Logs"
```

---

## 📋 Scripts Disponíveis

```bash
npm run dev            # Desenvolvimento
npm run build           # Compilar para produção
npm run start           # Servidor de produção
npm run deploy:vercel   # Deploy Vercel
npm run deploy:railway  # Deploy Railway
npm run docker:build     # Build Docker
npm run docker:run       # Executar Docker
npm run setup           # Setup inicial rápido
npm run clean           # Limpar cache
npm run db:push         # Atualizar banco
```

---

## ✅ Sucesso!

A aplicação está online em:
- **Vercel:** `https://sistema-gestao-docs.vercel.app`
- **Railway:** `https://sistema-gestao-docs.railway.app`

---

**Deploy feito em 3 minutos!** ⏱️
