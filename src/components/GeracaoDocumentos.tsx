'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, FileText, Download, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface Template {
  id?: string
  nome?: string
  descricao?: string
  tipo?: string
  conteudo?: string
  campos?: string[]
}

interface DocumentoGerado {
  id?: string
  templateId?: string
  templateNome?: string
  dados?: any
  arquivoUrl?: string
  createdAt?: string
}

export default function GeracaoDocumentos() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [documentos, setDocumentos] = useState<DocumentoGerado[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [templateForm, setTemplateForm] = useState<Template>({
    campos: [],
  })
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})

  useEffect(() => {
    loadTemplates()
    loadDocumentos()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/documents/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    }
  }

  const loadDocumentos = async () => {
    try {
      const response = await fetch('/api/documents/generated')
      if (response.ok) {
        const data = await response.json()
        setDocumentos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    }
  }

  const handleSaveTemplate = async () => {
    try {
      const url = editingTemplate?.id
        ? `/api/documents/update-template?id=${editingTemplate.id}`
        : '/api/documents/create-template'

      const response = await fetch(url, {
        method: editingTemplate?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateForm),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar template')
      }

      toast.success(editingTemplate?.id ? 'Template atualizado com sucesso!' : 'Template criado com sucesso!')
      resetTemplateForm()
      loadTemplates()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar template')
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) {
      return
    }

    try {
      const response = await fetch(`/api/documents/delete-template?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir template')
      }

      toast.success('Template excluído com sucesso!')
      loadTemplates()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao excluir template')
    }
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setTemplateForm({
      ...template,
      campos: template.campos || [],
    })
  }

  const resetTemplateForm = () => {
    setEditingTemplate(null)
    setTemplateForm({
      campos: [],
    })
  }

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) {
      toast.error('Selecione um template primeiro')
      return
    }

    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          dados: fieldValues,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar documento')
      }

      const data = await response.json()
      toast.success('Documento gerado com sucesso!')
      loadDocumentos()
      setFieldValues({})
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar documento')
    }
  }

  const parseCampos = () => {
    const content = templateForm.conteudo || ''
    const matches = content.match(/\{\{([^}]+)\}\}/g)
    const campos = matches ? matches.map(m => m.replace(/\{\{|\}\}/g, '')) : []
    setTemplateForm({ ...templateForm, campos })
  }

  return (
    <Tabs defaultValue="templates" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="templates">
          <FileText className="w-4 h-4 mr-2" />
          Templates
        </TabsTrigger>
        <TabsTrigger value="generate">
          <Download className="w-4 h-4 mr-2" />
          Gerar Documentos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingTemplate?.id ? 'Editar Template' : 'Criar Novo Template'}
            </CardTitle>
            <CardDescription>
              Crie templates de documentos com campos personalizáveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Template</Label>
                <Input
                  id="nome"
                  value={templateForm.nome || ''}
                  onChange={(e) => setTemplateForm({ ...templateForm, nome: e.target.value })}
                  placeholder="Ex: Contrato de Aluguer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={templateForm.tipo || ''}
                  onValueChange={(value) => setTemplateForm({ ...templateForm, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contrato">Contrato</SelectItem>
                    <SelectItem value="Declaracao">Declaração</SelectItem>
                    <SelectItem value="Recibo">Recibo</SelectItem>
                    <SelectItem value="Termo">Termo</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={templateForm.descricao || ''}
                onChange={(e) => setTemplateForm({ ...templateForm, descricao: e.target.value })}
                placeholder="Descrição do template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">
                Conteúdo do Template
                <span className="text-xs text-muted-foreground ml-2">
                  (Use {'{{campo}}'} para campos variáveis)
                </span>
              </Label>
              <Textarea
                id="conteudo"
                value={templateForm.conteudo || ''}
                onChange={(e) => setTemplateForm({ ...templateForm, conteudo: e.target.value })}
                onBlur={parseCampos}
                placeholder="CONTRATO DE ALUGUER&#10;&#10;Locador: {{nomeLocador}}&#10;Locatário: {{nomeLocatario}}&#10;Veículo: {{veiculo}}&#10;Data: {{data}}"
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Campos Detectados</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                {templateForm.campos?.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    Adicione campos usando {'{{campo}}'} no conteúdo
                  </span>
                ) : (
                  templateForm.campos.map((campo, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                    >
                      {campo}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveTemplate} className="flex-1">
                {editingTemplate?.id ? 'Atualizar Template' : 'Criar Template'}
              </Button>
              {editingTemplate?.id && (
                <Button onClick={resetTemplateForm} variant="outline">
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Templates Existentes</CardTitle>
            <CardDescription>
              Lista de templates cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum template cadastrado ainda
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {template.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {template.tipo} - {template.descricao}
                        </p>
                        {template.campos && template.campos.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.campos.slice(0, 5).map((campo, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted rounded"
                              >
                                {campo}
                              </span>
                            ))}
                            {template.campos.length > 5 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded">
                                +{template.campos.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTemplate(template.id!)}
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
      </TabsContent>

      <TabsContent value="generate" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerar Documento</CardTitle>
            <CardDescription>
              Selecione um template e preencha os campos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={selectedTemplate?.id || ''}
                onValueChange={(value) => {
                  const template = templates.find(t => t.id === value)
                  setSelectedTemplate(template || null)
                  setFieldValues({})
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id!}>
                      {template.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate?.campos && selectedTemplate.campos.length > 0 && (
              <div className="space-y-3">
                <Label>Campos do Template</Label>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTemplate.campos.map((campo) => (
                    <div key={campo} className="space-y-2">
                      <Label htmlFor={campo}>{campo}</Label>
                      <Input
                        id={campo}
                        value={fieldValues[campo] || ''}
                        onChange={(e) =>
                          setFieldValues({ ...fieldValues, [campo]: e.target.value })
                        }
                        placeholder={`Preencha ${campo}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerateDocument}
              disabled={!selectedTemplate || selectedTemplate.campos?.length === 0}
              className="w-full"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Gerar Documento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Gerados</CardTitle>
            <CardDescription>
              Histórico de documentos gerados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documentos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum documento gerado ainda
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {doc.templateNome}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Gerado em {new Date(doc.createdAt || '').toLocaleString('pt-PT')}
                        </p>
                      </div>
                      <Button size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
