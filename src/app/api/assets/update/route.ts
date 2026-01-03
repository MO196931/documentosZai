import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do ativo não fornecido' },
        { status: 400 }
      )
    }

    const body = await req.json()

    const ativo = await db.ativo.update({
      where: { id },
      data: {
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
        disponivel: body.disponivel,
        estado: body.estado,
        observacoes: body.observacoes,
      },
    })

    return NextResponse.json(ativo)
  } catch (error) {
    console.error('Erro ao atualizar ativo:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar ativo' },
      { status: 500 }
    )
  }
}
