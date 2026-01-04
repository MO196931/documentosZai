import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type

    const zai = await ZAI.create()

    const prompt = `Extraia todas as informações deste documento de identificação português e retorne em formato JSON com estes campos:
{
  "numero": "número do documento",
  "nome": "nome completo",
  "apelido": "apelido",
  "dataNascimento": "data de nascimento no formato DD/MM/YYYY",
  "naturalidade": "naturalidade",
  "nacionalidade": "nacionalidade",
  "sexo": "sexo (M/F)",
  "altura": "altura",
  "filiado": "filiado (pai e mãe)",
  "validade": "data de validade no formato DD/MM/YYYY",
  "emissao": "data de emissão no formato DD/MM/YYYY",
  "morada": "morada completa"
}

Retorne APENAS JSON válido, sem texto adicional.`

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('Nenhuma resposta do modelo')
    }

    let parsedData
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      parsedData = JSON.parse(cleanContent)
    } catch (e) {
      console.error('Erro ao fazer parse da resposta:', content)
      throw new Error('Erro ao processar a resposta do modelo')
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Erro ao extrair dados:', error)
    return NextResponse.json(
      { error: 'Erro ao extrair dados do documento' },
      { status: 500 }
    )
  }
}
