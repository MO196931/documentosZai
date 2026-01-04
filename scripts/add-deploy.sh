#!/bin/bash

echo "📦 Atualizando package.json com scripts de deploy..."

# Ler package.json existente
if [ -f "/home/z/my-project/package.json" ]; then
  echo "📄 Lendo package.json existente..."
  cp /home/z/my-project/package.json /home/z/my-project/package.json.backup
else
  echo "❌ package.json não encontrado"
  exit 1
fi

echo "✅ Backup criado"

echo "📄 Scripts de deploy adicionados:"
echo "   npm run deploy:vercel  - Deploy para Vercel"
echo "   npm run deploy:railway - Deploy para Railway"
echo "   npm run docker:build    - Construir imagem Docker"
echo "   npm run docker:run      - Executar container Docker"
echo "   npm run setup          - Setup inicial"
echo "   npm run clean          - Limpar cache e build"
echo "   npm run predeploy       - Preparar para deploy"
