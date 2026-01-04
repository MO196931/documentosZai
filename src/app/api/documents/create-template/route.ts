import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const template = await db.documentoTemplate.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        tipo: body.tipo,
        conteudo: body.conteudo,
        campos: JSON.stringify(body.campos || []),
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao criar template:', error)
    return NextResponse.json(
      { error: 'Erro ao criar template' },
      { status: 500 }
    )
  }
}
