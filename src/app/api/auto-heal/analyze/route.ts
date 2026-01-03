import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_ANALYSIS_PROMPT = `Tu és um especialista em diagnóstico de sistemas e programação. A tua função é analisar erros de sistemas e fornecer soluções inteligentes.

REGRAS DE ANÁLISE:
1. Analisa o erro de forma sistemática: tipo, causa provável, impacto
2. Classifica a severidade: LOW, MEDIUM, HIGH, CRITICAL
3. Identifica o tipo de problema: SYNTAX_ERROR, MISSING_FILE, PERFORMANCE, DATABASE, CONFIGURATION, SECURITY, DEPENDENCY, NETWORK
4. Fornece soluções específicas e acionáveis
5. Se possível, sugere código de correção
6. Considera o contexto da aplicação Next.js
7. Fornece explicações claras em português

FORMATO DE RESPOSTA JSON:
{
  "tipoProblema": "tipo do problema (ex: SYNTAX_ERROR)",
  "descricao": "descrição detalhada do problema",
  "causaProvavel": "causa mais provável",
  "solucao": "solução passo a passo",
  "codigoCorrecao": "código de correção se aplicável (opcional)",
  "severidade": "LOW/MEDIUM/HIGH/CRITICAL",
  "melhoriasAdicionais": ["lista de melhorias recomendadas"]
}

Exemplos de tipos de problemas:
- SYNTAX_ERROR: Erros de sintaxe em código TypeScript/JavaScript
- MISSING_FILE: Arquivos ou componentes em falta
- PERFORMANCE: Lentidão, tempos de resposta altos
- DATABASE: Erros de banco de dados, prisma
- CONFIGURATION: Problemas de configuração
- SECURITY: Vulnerabilidades ou problemas de segurança
- DEPENDENCY: Problemas com dependências
- NETWORK: Erros de API, requisições HTTP`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { logId } = body

    if (!logId) {
      return NextResponse.json(
        { error: 'ID do log é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar o log para analisar
    const log = await db.systemLog.findUnique({
      where: { id: logId },
    })

    if (!log) {
      return NextResponse.json(
        { error: 'Log não encontrado' },
        { status: 404 }
      )
    }

    // Criar instância ZAI
    const zai = await ZAI.create()

    // Construir contexto para análise
    const contexto = `
Tipo de erro: ${log.tipo}
Nível: ${log.nivel}
Mensagem: ${log.mensagem}
${log.arquivo ? `Arquivo: ${log.arquivo}` : ''}
${log.linha ? `Linha: ${log.linha}` : ''}
${log.detalhes ? `Detalhes: ${log.detalhes}` : ''}
${log.stackTrace ? `Stack trace: ${log.stackTrace.substring(0, 1000)}` : ''}

Analisa este erro e fornece:
1. Tipo exato do problema
2. Causa provável
3. Solução detalhada passo a passo
4. Código de correção se aplicável
5. Severidade baseada no impacto
6. Melhorias adicionais recomendadas`

    // Obter análise do LLM
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: SYSTEM_ANALYSIS_PROMPT
        },
        {
          role: 'user',
          content: contexto
        }
      ],
      thinking: { type: 'disabled' }
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error('Sem resposta do modelo')
    }

    // Parsear resposta JSON
    let analise
    try {
      const cleanContent = responseContent.replace(/```json\n?|\n?```/g, '').trim()
      analise = JSON.parse(cleanContent)
    } catch (e) {
      console.error('Erro ao fazer parse da análise:', responseContent)
      throw new Error('Erro ao processar análise do modelo')
    }

    // Criar correção no banco
    const correcao = await db.correcaoSistema.create({
      data: {
        logId,
        tipoProblema: analise.tipoProblema,
        descricao: analise.descricao,
        causaProvavel: analise.causaProvavel,
        solucao: analise.solucao,
        codigoCorrecao: analise.codigoCorrecao,
        severidade: analise.severidade || 'MEDIUM',
        aplicada: false,
        confirmada: false,
      },
    })

    return NextResponse.json({
      success: true,
      correcao: {
        id: correcao.id,
        ...analise,
      }
    })
  } catch (error) {
    console.error('Erro ao analisar problema:', error)
    return NextResponse.json(
      { error: 'Erro ao analisar problema' },
      { status: 500 }
    )
  }
}
