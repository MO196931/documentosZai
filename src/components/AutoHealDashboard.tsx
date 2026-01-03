'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Database,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import TestErrorLog from '@/components/TestErrorLog'

interface Metrica {
  id: string
  tipo: string
  valor: number
  unidade: string
  status: string
  alerta: boolean
  descricaoAlerta: string
}

interface Log {
  id: string
  nivel: string
  tipo: string
  mensagem: string
  detalhes: string
  resolved: boolean
  autoResolved: boolean
  createdAt: string
  correcoes?: any[]
}

interface Correcao {
  id: string
  tipoProblema: string
  descricao: string
  causaProvavel: string
  solucao: string
  codigoCorrecao: string
  severidade: string
  aplicada: boolean
  confirmada: boolean
  log: Log
}

export default function AutoHealDashboard() {
  const [metricas, setMetricas] = useState<Record<string, Metrica>>({})
  const [logs, setLogs] = useState<Log[]>([])
  const [correcoes, setCorrecoes] = useState<Correcao[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [metricsRes, logsRes, correcoesRes] = await Promise.all([
        fetch('/api/auto-heal/metrics'),
        fetch('/api/auto-heal/logs'),
        fetch('/api/auto-heal/apply-fix'),
      ])

      if (metricsRes.ok) setMetricas(await metricsRes.json())
      if (logsRes.ok) setLogs(await logsRes.json())
      if (correcoesRes.ok) setCorrecoes(await correcoesRes.json())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const analyzeLog = async (logId: string) => {
    try {
      const response = await fetch('/api/auto-heal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao analisar')
      }

      const data = await response.json()
      toast.success('Análise concluída com sucesso!')
      loadData()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao analisar problema')
    }
  }

  const applyFix = async (correcaoId: string) => {
    if (!confirm('Deseja aplicar esta correção?')) {
      return
    }

    try {
      const response = await fetch('/api/auto-heal/apply-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correcaoId, confirmada: true }),
      })

      if (!response.ok) {
        throw new Error('Erro ao aplicar correção')
      }

      toast.success('Correção aplicada com sucesso!')
      loadData()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao aplicar correção')
    }
  }

  const getMetricaIcon = (tipo: string) => {
    switch (tipo) {
      case 'CPU':
        return <Zap className="w-5 h-5" />
      case 'MEMORY':
        return <Activity className="w-5 h-5" />
      case 'DATABASE_QUERY':
        return <Database className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getMetricaCor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'CRITICAL':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getSeveridadeBadge = (severidade: string) => {
    switch (severidade) {
      case 'LOW':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">BAIXA</Badge>
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">MÉDIA</Badge>
      case 'HIGH':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">ALTA</Badge>
      case 'CRITICAL':
        return <Badge variant="destructive">CRÍTICA</Badge>
      default:
        return <Badge variant="outline">{severidade}</Badge>
    }
  }

  const metricasArray = Object.values(metricas)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Auto-Cura</h2>
          <p className="text-muted-foreground">Monitorização inteligente do sistema</p>
        </div>
        <Button onClick={loadData} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="corrections">Correções</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Métricas do Sistema
              </CardTitle>
              <CardDescription>Monitorização em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              {metricasArray.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma métrica disponível
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {metricasArray.map((metrica) => (
                    <div
                      key={metrica.id}
                      className={`p-4 rounded-lg border-2 ${getMetricaCor(metrica.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMetricaIcon(metrica.tipo)}
                          <span className="font-semibold">{metrica.tipo}</span>
                        </div>
                        {metrica.alerta && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Alerta
                          </Badge>
                        )}
                      </div>
                      <div className="text-3xl font-bold mb-1">
                        {metrica.valor.toFixed(1)} {metrica.unidade}
                      </div>
                      <div className="text-sm opacity-80">
                        Status: {metrica.status}
                      </div>
                      {metrica.descricaoAlerta && (
                        <div className="text-sm mt-2 p-2 bg-black/10 rounded">
                          {metrica.descricaoAlerta}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Logs do Sistema
              </CardTitle>
              <CardDescription>Erros e avisos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum erro registrado
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getSeveridadeBadge(log.nivel)}
                            <Badge variant="outline">{log.tipo}</Badge>
                            {log.resolved ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resolvido
                              </Badge>
                            ) : (
                              log.autoResolved && (
                                <Badge variant="secondary">
                                  Auto-resolvido
                                </Badge>
                              )
                            )}
                          </div>
                          <p className="font-medium mb-2">{log.mensagem}</p>
                          {log.detalhes && (
                            <div className="text-sm text-muted-foreground mb-2">
                              <strong>Detalhes:</strong> {log.detalhes}
                            </div>
                          )}
                          {log.arquivo && (
                            <div className="text-xs text-muted-foreground">
                              {log.arquivo}:{log.linha}
                            </div>
                          )}
                        </div>
                        {!log.resolved && (
                          <Button
                            size="sm"
                            onClick={() => analyzeLog(log.id)}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Analisar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corrections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Correções Sugeridas
              </CardTitle>
              <CardDescription>Soluções geradas pelo sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {correcoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma correção disponível
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {correcoes.map((correcao) => (
                    <div
                      key={correcao.id}
                      className={`p-4 border rounded-lg ${
                        correcao.aplicada ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getSeveridadeBadge(correcao.severidade)}
                            <Badge variant="outline">{correcao.tipoProblema}</Badge>
                            {correcao.aplicada && (
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Aplicada
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium mb-2">{correcao.descricao}</p>
                          {correcao.causaProvavel && (
                            <div className="text-sm mb-2">
                              <strong>Causa provável:</strong> {correcao.causaProvavel}
                            </div>
                          )}
                          {correcao.solucao && (
                            <div className="text-sm mb-2">
                              <strong>Solução:</strong> {correcao.solucao}
                            </div>
                          )}
                          {correcao.codigoCorrecao && (
                            <div className="mt-2 p-3 bg-muted rounded font-mono text-xs overflow-x-auto">
                              <strong>Código:</strong>
                              <pre className="mt-2">{correcao.codigoCorrecao}</pre>
                            </div>
                          )}
                        </div>
                        {!correcao.aplicada && (
                          <Button
                            size="sm"
                            onClick={() => applyFix(correcao.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aplicar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TestErrorLog />
    </div>
  )
}
