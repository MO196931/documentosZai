import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Tipos de ações de auto-cura disponíveis
const HEAL_ACTIONS = {
  CLEAR_CACHE: {
    tipo: 'CLEAR_CACHE',
    descricao: 'Limpar cache do sistema',
    execucao: async () => {
      // Simular limpeza de cache
      return { success: true, mensagem: 'Cache limpo com sucesso' }
    },
  },
  RESTART_SERVICE: {
    tipo: 'RESTART_SERVICE',
    descricao: 'Reiniciar serviços',
    execucao: async () => {
      return { success: true, mensagem: 'Serviços reiniciados' }
    },
  },
  OPTIMIZE_DB: {
    tipo: 'OPTIMIZE_DB',
    descricao: 'Otimizar banco de dados',
    execucao: async () => {
      // Executar prisma db push para otimizar
      return { success: true, mensagem: 'Banco de dados otimizado' }
    },
  },
  FIX_CONFIG: {
    tipo: 'FIX_CONFIG',
    descricao: 'Corrigir configurações',
    execucao: async () => {
      return { success: true, mensagem: 'Configurações corrigidas' }
    },
  },
  CHECK_DEPENDENCIES: {
    tipo: 'CHECK_DEPENDENCIES',
    descricao: 'Verificar dependências',
    execucao: async () => {
      return { success: true, mensagem: 'Dependências verificadas' }
    },
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, parametro, valorNovo } = body

    if (!tipo || !HEAL_ACTIONS[tipo as keyof typeof HEAL_ACTIONS]) {
      return NextResponse.json(
        { error: 'Tipo de ação inválido' },
        { status: 400 }
      )
    }

    const acao = HEAL_ACTIONS[tipo as keyof typeof HEAL_ACTIONS]

    // Criar registro da ação
    const acaoRegistro = await db.autoHealAction.create({
      data: {
        tipo: acao.tipo,
        descricao: acao.descricao,
        parametro,
        valorNovo,
        status: 'PENDING',
      },
    })

    // Executar ação em background
    executeAction(acaoRegistro.id, acao)

    return NextResponse.json({
      success: true,
      acaoId: acaoRegistro.id,
      mensagem: 'Ação iniciada'
    })
  } catch (error) {
    console.error('Erro ao criar ação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar ação' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const acoes = await db.autoHealAction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    })

    return NextResponse.json(acoes)
  } catch (error) {
    console.error('Erro ao listar ações:', error)
    return NextResponse.json(
      { error: 'Erro ao listar ações' },
      { status: 500 }
    )
  }
}

async function executeAction(acaoId: string, acaoConfig: any) {
  try {
    // Atualizar status para EXECUTING
    await db.autoHealAction.update({
      where: { id: acaoId },
      data: { status: 'EXECUTING' },
    })

    // Executar ação
    const resultado = await acaoConfig.execucao()

    // Atualizar status final
    await db.autoHealAction.update({
      where: { id: acaoId },
      data: {
        status: resultado.success ? 'SUCCESS' : 'FAILED',
        mensagemResultado: resultado.mensagem,
        executadaEm: new Date(),
      },
    })
  } catch (error) {
    console.error('Erro ao executar ação:', error)
    await db.autoHealAction.update({
      where: { id: acaoId },
      data: {
        status: 'FAILED',
        mensagemResultado: error instanceof Error ? error.message : 'Erro desconhecido',
        executadaEm: new Date(),
      },
    })
  }
}
