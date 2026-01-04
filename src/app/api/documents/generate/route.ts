import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateId, dados } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'ID do template não fornecido' },
        { status: 400 }
      )
    }

    const template = await db.documentoTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    let conteudo = template.conteudo || ''

    Object.keys(dados).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      conteudo = conteudo.replace(regex, dados[key] || '')
    })

    const lines = conteudo.split('\n').filter(line => line.trim() !== '')

    const children = lines.map(line => {
      if (line.includes(':') && line.length < 100) {
        return new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      }

      return new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24,
          }),
        ],
        spacing: { after: 100 },
      })
    })

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)

    const gerado = await db.documentoGerado.create({
      data: {
        templateId,
        dados: JSON.stringify(dados),
        arquivoUrl: `/documents/generated/${Date.now()}.docx`,
      },
    })

    return NextResponse.json({
      success: true,
      documentoId: gerado.id,
      buffer: buffer.toString('base64'),
    })
  } catch (error) {
    console.error('Erro ao gerar documento:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar documento' },
      { status: 500 }
    )
  }
}
