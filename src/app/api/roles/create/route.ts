import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const role = await db.role.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        permissoes: body.permissoes ? JSON.stringify(body.permissoes) : null,
      },
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Erro ao criar papel:', error)
    return NextResponse.json(
      { error: 'Erro ao criar papel' },
      { status: 500 }
    )
  }
}
