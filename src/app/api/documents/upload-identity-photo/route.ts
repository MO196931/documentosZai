import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const tipo = formData.get('tipo') as string // FRENTE, VERSO, FOTOGRAFIA

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Por favor, selecione apenas imagens' },
        { status: 400 }
      )
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documentos')
    await mkdir(uploadsDir, { recursive: true })

    // Gerar nome único para o arquivo
    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`
    const filepath = path.join(uploadsDir, filename)

    // Converter arquivo para buffer e salvar
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    const url = `/uploads/documentos/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename,
      tipo,
      message: 'Foto carregada com sucesso!'
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload da foto' },
      { status: 500 }
    )
  }
}
