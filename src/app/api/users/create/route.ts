import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const user = await db.user.create({
      data: {
        email: body.email,
        name: body.name,
        apelido: body.apelido,
        telefone: body.telefone,
        morada: body.morada,
        dataNascimento: body.dataNascimento,
        ativo: body.ativo ?? true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao criar utilizador:', error)
    return NextResponse.json(
      { error: 'Erro ao criar utilizador' },
      { status: 500 }
    )
  }
}
