import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const log = await db.systemLog.create({
      data: {
        nivel: body.nivel || 'INFO',
        tipo: body.tipo || 'SYSTEM',
        mensagem: body.mensagem,
        detalhes: body.detalhes ? JSON.stringify(body.detalhes) : null,
        arquivo: body.arquivo,
        linha: body.linha,
        stackTrace: body.stackTrace,
        resolved: false,
        autoResolved: false,
      },
    })

    return NextResponse.json({
      success: true,
      logId: log.id
    })
  } catch (error) {
    console.error('Erro ao criar log:', error)
    return NextResponse.json(
      { error: 'Erro ao criar log' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const logs = await db.systemLog.findMany({
      include: {
        correcoes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Erro ao listar logs:', error)
    return NextResponse.json(
      { error: 'Erro ao listar logs' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      await db.systemLog.delete({ where: { id } })
    } else {
      await db.systemLog.deleteMany()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao eliminar logs:', error)
    return NextResponse.json(
      { error: 'Erro ao eliminar logs' },
      { status: 500 }
    )
  }
}
