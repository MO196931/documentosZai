import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { correcaoId, confirmada } = body

    if (!correcaoId) {
      return NextResponse.json(
        { error: 'ID da correção é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar correção como aplicada
    const correcao = await db.correcaoSistema.update({
      where: { id: correcaoId },
      data: {
        aplicada: true,
        confirmada: confirmada || false,
      },
    })

    // Marcar log como resolvido
    await db.systemLog.update({
      where: { id: correcao.logId },
      data: {
        resolved: true,
        autoResolved: true,
      },
    })

    return NextResponse.json({
      success: true,
      correcao
    })
  } catch (error) {
    console.error('Erro ao aplicar correção:', error)
    return NextResponse.json(
      { error: 'Erro ao aplicar correção' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const correcoes = await db.correcaoSistema.findMany({
      include: {
        log: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(correcoes)
  } catch (error) {
    console.error('Erro ao listar correções:', error)
    return NextResponse.json(
      { error: 'Erro ao listar correções' },
      { status: 500 }
    )
  }
}
