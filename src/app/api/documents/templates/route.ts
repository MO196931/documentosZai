import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const templates = await db.documentoTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Erro ao listar templates:', error)
    return NextResponse.json(
      { error: 'Erro ao listar templates' },
      { status: 500 }
    )
  }
}
