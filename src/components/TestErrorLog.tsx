'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bug, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function TestErrorLog() {
  const [tipo, setTipo] = useState('API')
  const [nivel, setNivel] = useState('ERROR')
  const [mensagem, setMensagem] = useState('')
  const [arquivo, setArquivo] = useState('')
  const [linha, setLinha] = useState('')

  const enviarLog = async () => {
    if (!mensagem) {
      toast.error('Por favor, insira uma mensagem de erro')
      return
    }

    try {
      const response = await fetch('/api/auto-heal/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          nivel,
          mensagem,
          arquivo,
          linha: linha ? parseInt(linha) : undefined,
          detalhes: {
            timestamp: new Date().toISOString(),
            userAction: 'manual_test',
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar log')
      }

      toast.success('Log de erro enviado com sucesso!')
      setMensagem('')
      setArquivo('')
      setLinha('')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao enviar log')
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-destructive" />
          Simular Erro do Sistema
        </CardTitle>
        <CardDescription>
          Envie logs de erro para testar o sistema de auto-cura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Erro</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="DATABASE">Database</SelectItem>
                <SelectItem value="UI">Interface do Utilizador</SelectItem>
                <SelectItem value="PERFORMANCE">Performance</SelectItem>
                <SelectItem value="SECURITY">Segurança</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivel">Nível do Erro</Label>
            <Select value={nivel} onValueChange={setNivel}>
              <SelectTrigger id="nivel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ERROR">ERROR</SelectItem>
                <SelectItem value="WARNING">WARNING</SelectItem>
                <SelectItem value="INFO">INFO</SelectItem>
                <SelectItem value="DEBUG">DEBUG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mensagem">Mensagem do Erro *</Label>
          <Input
            id="mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Ex: Erro ao buscar documento do template..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arquivo">Arquivo (opcional)</Label>
            <Input
              id="arquivo"
              value={arquivo}
              onChange={(e) => setArquivo(e.target.value)}
              placeholder="Ex: src/components/Card.tsx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linha">Linha (opcional)</Label>
            <Input
              id="linha"
              type="number"
              value={linha}
              onChange={(e) => setLinha(e.target.value)}
              placeholder="Ex: 42"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p className="text-sm">
            Esta funcionalidade permite testar o sistema de auto-cura. Ao enviar um erro,
            o sistema irá analisá-lo e sugerir soluções automáticas.
          </p>
        </div>

        <Button onClick={enviarLog} className="w-full" disabled={!mensagem}>
          <Bug className="w-4 h-4 mr-2" />
          Enviar Log de Erro
        </Button>
      </CardContent>
    </Card>
  )
}
