#!/bin/bash

case "$1" in
  deploy-vercel|vercel|"deploy:vercel")
    echo "🚀 Deploy para Vercel"
    echo "Comando: npm run deploy:vercel"
    echo ""
    echo "Como fazer:"
    echo "  npm run deploy:vercel"
    echo ""
    echo "Requisitos:"
    echo "  1. npm i -g vercel"
    echo "  2. vercel login"
    ;;

  deploy-railway|railway|"deploy:railway")
    echo "🚀 Deploy para Railway"
    echo "Comando: npm run deploy:railway"
    echo ""
    echo "Vantagens:"
    echo "  ✅ Interface visual amigavel"
    echo "  ✅ Banco PostgreSQL gratis"
    echo "  ✅ Deploy via GitHub automatico"
    ;;

  docker|container)
    echo "🐳 Deploy com Docker"
    echo ""
    echo "Comandos:"
    echo "  npm run docker:build  - Construir imagem"
    echo "  npm run docker:run    - Executar container"
    ;;

  setup|init)
    echo "🔧 Setup Inicial"
    echo "Comando: npm run setup"
    echo ""
    echo "Executa:"
    echo "  ✓ bun install"
    echo "  ✓ bun run db:generate"
    echo "  ✓ mkdir -p public/uploads"
    ;;

  clean)
    echo "🧹 Limpar Cache e Builds"
    echo "Comando: npm run clean"
    echo ""
    echo "Remove:"
    echo "  ✓ .next/"
    echo "  ✓ node_modules/.cache/"
    ;;

  predeploy|build)
    echo "📦 Preparar para Deploy"
    echo "Comando: npm run predeploy"
    echo ""
    echo "Executa:"
    echo "  ✓ npm run clean"
    echo "  ✓ npm run build"
    ;;

  test)
    echo "🧪 Testes"
    echo ""
    echo "Testes disponiveis:"
    echo "  npm run type-check"
    echo "  npm run lint"
    ;;

  help|--h|"")
    echo "📚 Ajuda - Sistema de Gestao de Documentos"
    echo ""
    echo "Deploy:"
    echo "  deploy-vercel   - Deploy para Vercel"
    echo "  deploy-railway - Deploy para Railway"
    echo "  docker           - Ajuda para Docker"
    echo ""
    echo "Setup:"
    echo "  setup            - Setup inicial"
    echo "  init             - Mesmo que setup"
    echo ""
    echo "Build:"
    echo "  build            - Build de producao"
    echo "  predeploy         - Preparar para deploy (clean + build)"
    echo "  clean            - Limpar cache e builds"
    echo ""
    echo "Testes:"
    echo "  test             - Testes antes de deploy"
    echo ""
    echo "Database:"
    echo "  db:push          - Atualizar schema do banco"
    echo "  db:generate       - Gerar cliente Prisma"
    echo "  db:reset          - Resetar banco (cuidado!)"
    echo ""
    echo "Documentacao:"
    echo "  README.md         - Documentacao completa"
    echo "  DEPLOYMENT.md     - Guia detalhado de deploy"
    echo "  QUICK_DEPLOY.md   - Deploy rapido"
    echo ""
    echo "🚀 Deploy Rápido:"
    echo "  npm run setup       - Setup inicial"
    echo "  npm run predeploy    - Preparar para deploy"
    echo "  npm run deploy-vercel - Deploy para Vercel"
    echo ""
    echo "💡 Use 'npm run <script>' para executar qualquer script"
    ;;

  *)
    echo "❌ Comando nao reconhecido: $1"
    echo ""
    echo "Use 'help' para ver comandos disponiveis"
    exit 1
    ;;
esac

exit 0
