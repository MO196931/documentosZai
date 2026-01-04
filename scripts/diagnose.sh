#!/bin/bash

# Script de Diagnóstico Automático
# Versão: 1.0
# Data: $(date +%Y-%m-%d)

echo "========================================"
echo "  DIAGNÓSTICO AUTOMÁTICO DO SISTEMA"
echo "  Sistema de Gestão de Documentos"
echo "========================================"
echo ""

# 1. Verificar Servidor
echo "1. Verificando servidor de desenvolvimento..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Servidor rodando em http://localhost:3000"
else
    echo "   ❌ Servidor NÃO está rodando"
fi
echo ""

# 2. Verificar Build
echo "2. Verificando build de produção..."
if [ -d ".next" ]; then
    echo "   ✅ Diretório .next existe"
else
    echo "   ❌ Diretório .next NÃO existe (precisa fazer build)"
fi
echo ""

# 3. Verificar Banco de Dados
echo "3. Verificando banco de dados..."
if [ -f "db/custom.db" ]; then
    echo "   ✅ Banco de dados SQLite existe"
    file db/custom.db
else
    echo "   ❌ Banco de dados NÃO existe"
fi
echo ""

# 4. Verificar Diretório de Uploads
echo "4. Verificando diretório de uploads..."
if [ -d "public/uploads" ]; then
    ARQUIVOS=$(find public/uploads -type f | wc -l)
    echo "   ✅ Diretório public/uploads existe"
    echo "   📊 Arquivos carregados: $ARQUIVOS"
else
    echo "   ❌ Diretório public/uploads NÃO existe"
fi
echo ""

# 5. Verificar Logs
echo "5. Verificando logs do desenvolvedor..."
if [ -f "dev.log" ]; then
    ERROS=$(grep -i "error\|fail\|exception" dev.log | wc -l)
    echo "   ✅ Arquivo dev.log existe"
    echo "   📊 Erros/Exceções nos logs: $ERROS"
else
    echo "   ❌ Arquivo dev.log NÃO existe"
fi
echo ""

# 6. Verificar Dependências
echo "6. Verificando dependências principais..."
if grep -q '"next":' package.json; then
    echo "   ✅ Next.js instalado"
else
    echo "   ❌ Next.js NÃO encontrado em package.json"
fi
echo ""

# 7. Verificar Status do Git
echo "7. Verificando status do Git..."
if [ -d ".git" ]; then
    BRANCH=$(git branch --show-current)
    COMMIT=$(git log -1 --oneline)
    echo "   ✅ Git inicializado"
    echo "   📌 Branch atual: $BRANCH"
    echo "   📝 Último commit: $COMMIT"
else
    echo "   ❌ Git NÃO inicializado"
fi
echo ""

echo "========================================"
echo "  DIAGNÓSTICO COMPLETO"
echo "========================================"
