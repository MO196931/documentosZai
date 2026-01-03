'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Edit2, Users, UserCheck, X, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id?: string
  email?: string
  name?: string
  apelido?: string
  telefone?: string
  morada?: string
  ativo?: boolean
  dataNascimento?: string
  roles?: Array<{ id: string; nome: string; descricao: string }>
}

interface Role {
  id: string
  nome: string
  descricao?: string
}

export default function GestaoUtilizadores() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState<User>({
    ativo: true,
  })

  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users/list')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error)
    }
  }

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
        ? `/api/users/update?id=${editingId}`
        : '/api/users/create'

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar utilizador')
      }

      toast.success(editingId ? 'Utilizador atualizado com sucesso!' : 'Utilizador criado com sucesso!')
      resetForm()
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar utilizador')
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id || null)
    setFormData({ ...user })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este utilizador?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/delete?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao eliminar utilizador')
      }

      toast.success('Utilizador eliminado com sucesso!')
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao eliminar utilizador')
    }
  }

  const handleAssignRole = async (roleId: string) => {
    if (!assigningUserId) return

    try {
      const response = await fetch('/api/users/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: assigningUserId,
          roleId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atribuir papel')
      }

      toast.success('Papel atribuído com sucesso!')
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atribuir papel')
    }
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`/api/users/assign-role?userId=${userId}&roleId=${roleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover papel')
      }

      toast.success('Papel removido com sucesso!')
      loadUsers()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao remover papel')
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ ativo: true })
  }

  const availableRoles = roles.filter(
    role => !editingId || !formData.roles?.find(r => r.id === role.id)
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}
          </CardTitle>
          <CardDescription>
            Preencha os dados do utilizador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone || ''}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="+351 123 456 789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome próprio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apelido">Apelido</Label>
              <Input
                id="apelido"
                value={formData.apelido || ''}
                onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                placeholder="Apelido"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento || ''}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="morada">Morada</Label>
              <Textarea
                id="morada"
                value={formData.morada || ''}
                onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                placeholder="Morada completa..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={formData.ativo || false}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label htmlFor="ativo">Utilizador Ativo</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {editingId ? 'Atualizar Utilizador' : 'Criar Utilizador'}
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
            <Users className="w-5 h-5" />
            Utilizadores do Sistema
          </CardTitle>
          <CardDescription>
            Lista de utilizadores e papéis associados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum utilizador cadastrado ainda
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {user.name} {user.apelido}
                        </h3>
                        {!user.ativo && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {user.telefone && (
                        <p className="text-sm text-muted-foreground">
                          {user.telefone}
                        </p>
                      )}

                      {user.roles && user.roles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="group relative text-xs px-2 py-1 bg-primary/10 text-primary rounded flex items-center gap-1"
                            >
                              <Shield className="w-3 h-3" />
                              {role.nome}
                              <button
                                onClick={() => handleRemoveRole(user.id!, role.id)}
                                className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={assigningUserId === user.id} onOpenChange={(open) => !open && setAssigningUserId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAssigningUserId(user.id!)}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Atribuir Papel</DialogTitle>
                            <DialogDescription>
                              Selecione um papel para atribuir a {user.name} {user.apelido}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <Select onValueChange={(value) => handleAssignRole(value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um papel" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles.map((role) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.nome}
                                    {role.descricao && ` - ${role.descricao}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setAssigningUserId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user.id!)}
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
