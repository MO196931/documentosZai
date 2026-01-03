'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Car, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface Ativo {
  id?: string
  nome?: string
  descricao?: string
  marca?: string
  modelo?: string
  ano?: string
  placaMatricula?: string
  numeroSerie?: string
  valorDiario?: number
  valorSemanal?: number
  valorMensal?: number
  disponivel?: boolean
  estado?: string
  observacoes?: string
}

export default function GestaoAtivos() {
  const [ativos, setAtivos] = useState<Ativo[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Ativo>({
    disponivel: true,
    estado: 'Novo',
  })

  useEffect(() => {
    loadAtivos()
  }, [])

  const loadAtivos = async () => {
    try {
      const response = await fetch('/api/assets/list')
      if (response.ok) {
        const data = await response.json()
        setAtivos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar ativos:', error)
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/assets/update?id=${editingId}`
        : '/api/assets/create'

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipoId: 'default',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar ativo')
      }

      toast.success(editingId ? 'Ativo atualizado com sucesso!' : 'Ativo criado com sucesso!')
      resetForm()
      loadAtivos()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar ativo')
    }
  }

  const handleEdit = (ativo: Ativo) => {
    setEditingId(ativo.id || null)
    setFormData({ ...ativo })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ativo?')) {
      return
    }

    try {
      const response = await fetch(`/api/assets/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir ativo')
      }

      toast.success('Ativo excluído com sucesso!')
      loadAtivos()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao excluir ativo')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      disponivel: true,
      estado: 'Novo',
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? 'Editar Ativo' : 'Adicionar Novo Ativo'}
          </CardTitle>
          <CardDescription>
            Preencha os dados do ativo para aluguel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Ativo</Label>
              <Input
                id="nome"
                value={formData.nome || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Carro, Moto, Barco..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado || 'Novo'}
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Usado">Usado</SelectItem>
                  <SelectItem value="Reformado">Reformado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca || ''}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Ex: Toyota, BMW..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo || ''}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Ex: Corolla, X5..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={formData.ano || ''}
                onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                placeholder="Ex: 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placaMatricula">Placa de Matrícula</Label>
              <Input
                id="placaMatricula"
                value={formData.placaMatricula || ''}
                onChange={(e) => setFormData({ ...formData, placaMatricula: e.target.value })}
                placeholder="Ex: XX-00-XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de Série</Label>
              <Input
                id="numeroSerie"
                value={formData.numeroSerie || ''}
                onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                placeholder="Número de série do ativo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorDiario">Valor Diário (€)</Label>
              <Input
                id="valorDiario"
                type="number"
                step="0.01"
                value={formData.valorDiario || ''}
                onChange={(e) => setFormData({ ...formData, valorDiario: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorSemanal">Valor Semanal (€)</Label>
              <Input
                id="valorSemanal"
                type="number"
                step="0.01"
                value={formData.valorSemanal || ''}
                onChange={(e) => setFormData({ ...formData, valorSemanal: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorMensal">Valor Mensal (€)</Label>
              <Input
                id="valorMensal"
                type="number"
                step="0.01"
                value={formData.valorMensal || ''}
                onChange={(e) => setFormData({ ...formData, valorMensal: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição detalhada do ativo..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                id="disponivel"
                checked={formData.disponivel || false}
                onCheckedChange={(checked) => setFormData({ ...formData, disponivel: checked })}
              />
              <Label htmlFor="disponivel">Disponível para Aluguer</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {editingId ? 'Atualizar Ativo' : 'Criar Ativo'}
            </Button>
            {editingId && (
              <Button onClick={resetForm} variant="outline">
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Ativos Disponíveis
          </CardTitle>
          <CardDescription>
            Lista de ativos cadastrados para aluguel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ativos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum ativo cadastrado ainda
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ativos.map((ativo) => (
                <div
                  key={ativo.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {ativo.nome || 'Sem nome'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {ativo.marca} {ativo.modelo} - {ativo.ano}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {ativo.estado}
                        </span>
                        {ativo.disponivel ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            Disponível
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                            Indisponível
                          </span>
                        )}
                      </div>
                      {ativo.valorDiario && (
                        <p className="text-sm font-medium mt-2">
                          €{ativo.valorDiario.toFixed(2)} / dia
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(ativo)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(ativo.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
