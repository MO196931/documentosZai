'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Send, Bot, User, Save, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AssistenteJuridico() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `legal-${Date.now()}`)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateData, setTemplateData] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    conteudo: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/legal-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      await fetch(`/api/legal-assistant/chat?sessionId=${sessionId}`, {
        method: 'DELETE',
      })
      setMessages([])
      toast.success('Conversa limpa com sucesso')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao limpar conversa')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const prepareTemplate = (content: string) => {
    // Remover formatação Markdown para obter texto limpo
    let cleanContent = content
      .replace(/#{1,3}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/- /g, '')
      .replace(/\n{3,}/g, '\n\n')

    // Gerar um nome baseado no conteúdo
    const firstLine = cleanContent.split('\n')[0] || 'Documento'
    const tipo = firstLine.substring(0, 30).trim()

    setTemplateData({
      nome: tipo,
      descricao: `Template gerado pelo assistente jurídico em ${new Date().toLocaleDateString('pt-PT')}`,
      tipo: 'Jurídico',
      conteudo: cleanContent,
    })
    setShowSaveDialog(true)
  }

  const saveTemplate = async () => {
    try {
      const response = await fetch('/api/legal-assistant/save-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar template')
      }

      toast.success('Template salvo com sucesso!')
      setShowSaveDialog(false)
      setTemplateData({ nome: '', descricao: '', tipo: '', conteudo: '' })
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar template')
    }
  }

  const examplePrompts = [
    'Preciso de um contrato de aluguer de veículo',
    'Quais são os pontos importantes num contrato de prestação de serviços?',
    'Cria um modelo de declaração de responsabilidade',
    'Preciso de um termo de confidencialidade',
    'Quais cláusulas devo incluir num contrato de arrendamento?',
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Assistente Jurídico
          </CardTitle>
          <CardDescription>
            Peça ajuda para criar e melhorar templates de documentos legais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <Bot className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold mb-2">
                  Olá! Sou o seu assistente jurídico
                </p>
                <p className="text-sm text-muted-foreground">
                  Posso ajudar a criar e melhorar templates de documentos legais em Portugal.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-6 max-w-2xl mx-auto">
                {examplePrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                    className="text-left justify-start text-xs h-auto py-3 px-3"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => prepareTemplate(message.content)}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Salvar como Template
                        </Button>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escreva a sua mensagem... (Shift+Enter para nova linha)"
              className="min-h-[80px] resize-none"
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  onClick={clearChat}
                  variant="destructive"
                  size="icon"
                  title="Limpar conversa"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Salvar como Template
            </DialogTitle>
            <DialogDescription>
              Personalize os detalhes do template antes de salvar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-nome">Nome do Template</Label>
              <Input
                id="template-nome"
                value={templateData.nome}
                onChange={(e) =>
                  setTemplateData({ ...templateData, nome: e.target.value })
                }
                placeholder="Ex: Contrato de Aluguer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-tipo">Tipo de Documento</Label>
              <Input
                id="template-tipo"
                value={templateData.tipo}
                onChange={(e) =>
                  setTemplateData({ ...templateData, tipo: e.target.value })
                }
                placeholder="Ex: Contrato, Declaração, Termo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-descricao">Descrição</Label>
              <Textarea
                id="template-descricao"
                value={templateData.descricao}
                onChange={(e) =>
                  setTemplateData({ ...templateData, descricao: e.target.value })
                }
                placeholder="Descrição breve do template..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveTemplate} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Salvar Template
              </Button>
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
