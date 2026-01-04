import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do template não fornecido' },
        { status: 400 }
      )
    }

    const body = await req.json()

    const template = await db.documentoTemplate.update({
      where: { id },
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
    console.error('Erro ao atualizar template:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar template' },
      { status: 500 }
    )
  }
}
