import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const documentos = await db.documentoGerado.findMany({
      include: {
        template: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const documentosComNome = documentos.map(doc => ({
      ...doc,
      templateNome: doc.template.nome,
    }))

    return NextResponse.json(documentosComNome)
  } catch (error) {
    console.error('Erro ao listar documentos gerados:', error)
    return NextResponse.json(
      { error: 'Erro ao listar documentos gerados' },
      { status: 500 }
    )
  }
}
