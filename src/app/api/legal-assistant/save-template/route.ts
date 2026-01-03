import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { nome, descricao, tipo, conteudo, campos } = await req.json()

    if (!nome || !conteudo) {
      return NextResponse.json(
        { error: 'Nome e conteúdo são obrigatórios' },
        { status: 400 }
      )
    }

    const template = await db.documentoTemplate.create({
      data: {
        nome,
        descricao,
        tipo,
        conteudo,
        campos: campos ? JSON.stringify(campos) : null,
      },
    })

    return NextResponse.json({
      success: true,
      template
    })
  } catch (error) {
    console.error('Erro ao salvar template:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar template' },
      { status: 500 }
    )
  }
}
