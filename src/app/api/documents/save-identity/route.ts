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
      nacionalidade,
      sexo,
      altura,
      filiado,
      validade,
      emissao,
      morada,
      tipoDocumentoId,
      fotos,
    } = body

    if (!numero || !nome) {
      return NextResponse.json(
        { error: 'Número e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar documento
    const documento = await db.documentoIdentificacao.create({
      data: {
        numero,
        nome,
        apelido,
        dataNascimento,
        naturalidade,
        nacionalidade,
        sexo,
        altura,
        filiado,
        validade,
        emissao,
        morada,
        tipoDocumentoId: tipoDocumentoId || 'default',
        ativo: false,
      },
    })

    // Criar fotos associadas se fornecidas
    if (fotos && Array.isArray(fotos) && fotos.length > 0) {
      const fotosData = fotos.map((foto: any, index: number) => ({
        documentoId: documento.id,
        tipo: foto.tipo, // FRENTE, VERSO, FOTOGRAFIA
        url: foto.url,
        ordem: index + 1,
      }))

      await db.documentoFoto.createMany({
        data: fotosData,
      })
    }

    return NextResponse.json({
      success: true,
      documentoId: documento.id,
      message: 'Documento salvo com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao salvar documento:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar documento' },
      { status: 500 }
    )
  }
}
