import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do utilizador não fornecido' },
        { status: 400 }
      )
    }

    const body = await req.json()

    const user = await db.user.update({
      where: { id },
      data: {
        email: body.email,
        name: body.name,
        apelido: body.apelido,
        telefone: body.telefone,
        morada: body.morada,
        dataNascimento: body.dataNascimento,
        ativo: body.ativo,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar utilizador' },
      { status: 500 }
    )
  }
}
