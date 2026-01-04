import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Armazenar conversas em memória (em produção, usar base de dados)
const conversations = new Map<string, Array<{ role: string; content: string }>>()

const SYSTEM_PROMPT = `Tu és um assistente jurídico especializado em direito português. A tua função é ajudar os utilizadores a criar templates de documentos legais.

REGRAS IMPORTANTES:
1. Usa apenas o direito português e legislação aplicável em Portugal
2. Fornece sempre sugestões de melhorias e pontos a considerar
3. Alerta para riscos ou lacunas legais importantes
4. Sugere cláusulas padrão que são comuns neste tipo de documento
5. Sempre que possível, fornece exemplos de cláusulas bem redigidas
6. Mantém uma linguagem formal jurídica apropriada para Portugal
7. Organiza a resposta de forma clara e estruturada
8. Quando o utilizador pede para criar um documento, fornece o conteúdo completo em formato estrutulado

ESTRUTURA DE RESPOSTA:
1. Breve explicação do tipo de documento
2. Pontos importantes a considerar
3. Sugestões de cláusulas
4. Conteúdo do documento (se solicitado)
5. Dicas adicionais e recomendações

Quando o utilizador pedir para gerar um documento/template, formata o conteúdo em Markdown com:
- Títulos em ## ou ###
- Listas numeradas para cláusulas
- Subsecções para organizar o conteúdo
- [NOME] ou [DATA] para campos que devem ser preenchidos`

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Obter ou criar histórico da conversa
    let history = conversations.get(sessionId) || [
      {
        role: 'assistant',
        content: SYSTEM_PROMPT
      }
    ]

    // Adicionar mensagem do utilizador
    history.push({
      role: 'user',
      content: message
    })

    // Criar instância ZAI e obter resposta
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: history,
      thinking: { type: 'disabled' }
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Sem resposta do modelo')
    }

    // Adicionar resposta ao histórico
    history.push({
      role: 'assistant',
      content: aiResponse
    })

    // Limitar histórico (manter últimas 20 mensagens)
    if (history.length > 21) { // 1 system + 20 mensagens
      history = [
        history[0], // Manter system prompt
        ...history.slice(-20) // Últimas 20 mensagens
      ]
    }

    // Salvar histórico atualizado
    conversations.set(sessionId, history)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      historyLength: history.length - 1 // Exclui system prompt
    })
  } catch (error) {
    console.error('Erro no assistente jurídico:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a mensagem' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      conversations.delete(sessionId)
    } else {
      conversations.clear()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao limpar conversa:', error)
    return NextResponse.json(
      { error: 'Erro ao limpar conversa' },
      { status: 500 }
    )
  }
}
