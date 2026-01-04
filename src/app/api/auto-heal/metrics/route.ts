import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, valor, unidade } = body

    // Determinar status baseado no tipo e valor
    let status = 'NORMAL'
    let alerta = false
    let descricaoAlerta = null

    if (tipo === 'CPU' && valor > 80) {
      status = 'CRITICAL'
      alerta = true
      descricaoAlerta = 'Uso de CPU acima de 80%'
    } else if (tipo === 'MEMORY' && valor > 85) {
      status = 'WARNING'
      alerta = true
      descricaoAlerta = 'Uso de memória acima de 85%'
    } else if (tipo === 'API_RESPONSE' && valor > 1000) {
      status = 'WARNING'
      alerta = true
      descricaoAlerta = 'Tempo de resposta da API acima de 1s'
    } else if (tipo === 'DATABASE_QUERY' && valor > 500) {
      status = 'WARNING'
      alerta = true
      descricaoAlerta = 'Query de banco lenta (> 500ms)'
    }

    const metrica = await db.systemMetrics.create({
      data: {
        tipo,
        valor,
        unidade: unidade || '%',
        status,
        alerta,
        descricaoAlerta,
      },
    })

    return NextResponse.json({
      success: true,
      metrica
    })
  } catch (error) {
    console.error('Erro ao criar métrica:', error)
    return NextResponse.json(
      { error: 'Erro ao criar métrica' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const metricas = await db.systemMetrics.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    // Agrupar por tipo para mostrar as mais recentes
    const metricasPorTipo = metricas.reduce((acc, m) => {
      if (!acc[m.tipo] || m.createdAt > acc[m.tipo].createdAt) {
        acc[m.tipo] = m
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(metricasPorTipo)
  } catch (error) {
    console.error('Erro ao listar métricas:', error)
    return NextResponse.json(
      { error: 'Erro ao listar métricas' },
      { status: 500 }
    )
  }
}
