import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      numero,
      nome,
      apelido,
      dataNascimento,
      naturalidade,
      categoria,
      validade,
      emissao,
      numeroRegisto,
      morada,
      rawExtraido,
      fotos,
    } = body

    if (!numero || !nome) {
      return NextResponse.json(
        { error: 'Número e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar carta de condução
    const carta = await db.cartaConducao.create({
      data: {
        numero,
        nome,
        apelido,
        dataNascimento,
        naturalidade,
        categoria,
        validade,
        emissao,
        numeroRegisto,
        morada,
        rawExtraido,
        ativo: true,
      },
    })

    // Criar fotos associadas se fornecidas
    if (fotos && Array.isArray(fotos) && fotos.length > 0) {
      const fotosData = fotos.map((foto: any, index: number) => ({
        cartaId: carta.id,
        tipo: foto.tipo, // FRENTE, VERSO, FOTOGRAFIA, OUTRA
        url: foto.url,
        ordem: index + 1,
      }))

      await db.documentoFoto.createMany({
        data: fotosData,
      })
    }

    return NextResponse.json({
      success: true,
      cartaId: carta.id,
      message: 'Carta de condução salva com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao salvar carta:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar carta de condução' },
      { status: 500 }
    )
  }
}
