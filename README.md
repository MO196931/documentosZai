# Sistema de Gestão de Documentos

Sistema completo para gestão de documentos, extração automática de dados e auto-cura inteligente.

## 🚀 Deploy Rápido

### Método 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

### Método 2: Docker (Universal)

```bash
# Construir imagem
docker build -t sistema-gestao-documentos .

# Executar container
docker run -p 3000:3000 sistema-gestao-documentos

# Com tag de versão
docker build -t sistema-gestao-documentos:v1.0 .
```

### Método 3: Railway (Fácil)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Fazer deploy
railway up
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` ou configure na plataforma de deploy:

```env
DATABASE_URL=file:./db/custom.db
NODE_ENV=production
```

### 2. Banco de Dados

O sistema usa **SQLite** por padrão, ideal para:
- Deploy rápido (não precisa de servidor PostgreSQL)
- Escalamento automático
- Backups automáticos

## 📋 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run db:push       # Atualizar schema do banco de dados
npm run db:generate  # Gerar cliente Prisma
npm run lint          # Verificar código
```

### Produção
```bash
npm run build         # Compilar para produção
npm run start          # Iniciar servidor de produção
```

### Database
```bash
npm run db:push       # Atualizar schema sem perder dados
npm run db:migrate    # Executar migrações
npm run db:reset       # Resetar banco de dados (cuidado!)
```

## 🏗️ Funcionalidades

### 1. Documentos de Identificação
- ✅ Upload de frente, verso e fotografia
- ✅ Extração automática de dados
- ✅ Suporte para BI, Passaporte, Cartão de Cidadão
- ✅ Pré-visualização antes de guardar

### 2. Cartas de Condução
- ✅ Upload de frente, verso e fotografia
- ✅ Dados completos do titular
- ✅ Categorias de condução (B, BE, C, CE, etc.)
- ✅ Validação automática

### 3. Gestão de Ativos
- ✅ Cadastro de veículos e equipamentos
- ✅ Valores de aluguer (diário, semanal, mensal)
- ✅ Status de disponibilidade
- ✅ Upload de fotos

### 4. Geração de Documentos
- ✅ Criação de templates
- ✅ Preenchimento automático
- ✅ Geração de PDF (implementar)
- ✅ Campos personalizáveis

### 5. Assistente Jurídico 🤖
- ✅ Chat com IA especializada em direito português
- ✅ Geração de templates jurídicos
- ✅ Sugestões de melhorias
- ✅ Salvar como template reutilizável

### 6. Auto-Cura Inteligente 🚑
- ✅ Monitorização de erros do sistema
- ✅ Análise inteligente com LLM
- ✅ Sugestões automáticas de correções
- ✅ Aplicação de correções com um clique
- ✅ Métricas em tempo real (CPU, Memória, DB, API)

### 7. Gestão de Utilizadores 👥
- ✅ CRUD completo de utilizadores
- ✅ Sistema de papéis/roles
- ✅ Permissões personalizadas
- ✅ Atribuição múltipla de papéis

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/              # APIs do sistema
│   │   ├── documents/     # Documentos e uploads
│   │   ├── users/         # Gestão de utilizadores
│   │   ├── assets/        # Gestão de ativos
│   │   ├── auto-heal/     # Sistema de auto-cura
│   │   ├── legal-assistant/ # Assistente jurídico
│   └── page.tsx         # Página principal
├── components/           # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── DocumentosIdentificacao.tsx
│   ├── CartasConducao.tsx
│   ├── GestaoAtivos.tsx
│   ├── GeracaoDocumentos.tsx
│   ├── GestaoUtilizadores.tsx
│   ├── GestaoPapeis.tsx
│   ├── AssistenteJuridico.tsx
│   └── AutoHealDashboard.tsx
└── lib/
    ├── db.ts             # Cliente Prisma
    └── utils.ts          # Utilitários
```

## 🔧 Resolução de Problemas

### Erro 500
```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar cache do node
rm -rf node_modules
npm install
```

### Erros de Banco de Dados
```bash
# Resetar banco (perde todos os dados!)
npm run db:reset

# Apenas atualizar schema
npm run db:push
```

### Problemas de Upload
- Verifique se a pasta `public/uploads` existe
- Verifique as permissões do diretório
- Máximo de upload: 10MB por padrão

## 📚 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribuindo

O sistema está em desenvolvimento contínuo. Para contribuir:

1. Faça fork do repositório
2. Crie uma branch para a sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto é privado e propriedade do proprietário.

---

**Desenvolvido com:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Prisma, SQLite
**Assistente AI:** z-ai-web-dev-sdk (para análise jurídica e auto-cura)
