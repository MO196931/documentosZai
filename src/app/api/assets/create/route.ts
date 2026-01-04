import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const ativo = await db.ativo.create({
      data: {
        tipoId: body.tipoId || 'default',
        nome: body.nome,
        descricao: body.descricao,
        marca: body.marca,
        modelo: body.modelo,
        ano: body.ano,
        placaMatricula: body.placaMatricula,
        numeroSerie: body.numeroSerie,
        valorDiario: body.valorDiario,
        valorSemanal: body.valorSemanal,
        valorMensal: body.valorMensal,
        disponivel: body.disponivel ?? true,
        estado: body.estado,
        observacoes: body.observacoes,
      },
    })

    return NextResponse.json(ativo)
  } catch (error) {
    console.error('Erro ao criar ativo:', error)
    return NextResponse.json(
      { error: 'Erro ao criar ativo' },
      { status: 500 }
    )
  }
}
