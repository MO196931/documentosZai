import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do papel não fornecido' },
        { status: 400 }
      )
    }

    const body = await req.json()

    const role = await db.role.update({
      where: { id },
      data: {
        nome: body.nome,
        descricao: body.descricao,
        permissoes: body.permissoes ? JSON.stringify(body.permissoes) : null,
      },
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Erro ao atualizar papel:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar papel' },
      { status: 500 }
    )
  }
}
