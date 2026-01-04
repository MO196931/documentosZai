'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Edit2, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface Role {
  id?: string
  nome?: string
  descricao?: string
  permissoes?: string
}

interface RoleWithCount extends Role {
  userRoles?: number
}

export default function GestaoPapeis() {
  const [roles, setRoles] = useState<RoleWithCount[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Role>({})

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles/list')
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (error) {
      console.error('Erro ao carregar papéis:', error)
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/roles/update?id=${editingId}`
        : '/api/roles/create'

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar papel')
      }

      toast.success(editingId ? 'Papel atualizado com sucesso!' : 'Papel criado com sucesso!')
      resetForm()
      loadRoles()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar papel')
    }
  }

  const handleEdit = (role: Role) => {
    setEditingId(role.id || null)
    setFormData({ ...role })
  }

  const handleDelete = async (id: string) => {
    const role = roles.find(r => r.id === id)
    const userCount = role?.userRoles || 0

    if (userCount > 0) {
      toast.error(`Não é possível eliminar papel. Existem ${userCount} utilizadores associados.`)
      return
    }

    if (!confirm('Tem certeza que deseja eliminar este papel?')) {
      return
    }

    try {
      const response = await fetch(`/api/roles/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao eliminar papel')
      }

      toast.success('Papel eliminado com sucesso!')
      loadRoles()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao eliminar papel')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? 'Editar Papel' : 'Adicionar Novo Papel'}
          </CardTitle>
          <CardDescription>
            Crie e gerencie os papéis do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Papel</Label>
            <Input
              id="nome"
              value={formData.nome || ''}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Administrador, Gerente, Operador..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva as responsabilidades deste papel..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {editingId ? 'Atualizar Papel' : 'Criar Papel'}
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
            <Shield className="w-5 h-5" />
            Papéis do Sistema
          </CardTitle>
          <CardDescription>
            Lista de papéis cadastrados e utilizadores associados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum papel cadastrado ainda
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {role.nome || 'Sem nome'}
                      </h3>
                      {role.descricao && (
                        <p className="text-sm text-muted-foreground">
                          {role.descricao}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {role.userRoles || 0} utilizador(es)
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(role.id!)}
                        disabled={(role.userRoles || 0) > 0}
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
