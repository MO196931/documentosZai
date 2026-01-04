import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const ativos = await db.ativo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(ativos)
  } catch (error) {
    console.error('Erro ao listar ativos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar ativos' },
      { status: 500 }
    )
  }
}
