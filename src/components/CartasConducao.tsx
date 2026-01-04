'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Camera, X, CheckCircle, AlertCircle, FileText, Info, User } from 'lucide-react'
import { toast } from 'sonner'

interface Foto {
  url: string
  tipo: string
  ordem?: number
}

interface CartaData {
  numero?: string
  nome?: string
  apelido?: string
  dataNascimento?: string
  naturalidade?: string
  categoria?: string
  validade?: string
  emissao?: string
  numeroRegisto?: string
  morada?: string
  rawExtraido?: string
}

export default function CartasConducao() {
  const [loading, setLoading] = useState(false)
  const [uploadedFotos, setUploadedFotos] = useState<Foto[]>([])
  const [cartaData, setCartaData] = useState<CartaData>({})

  const handleUpload = async (tipo: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas imagens')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tipo', tipo)

      const response = await fetch('/api/documents/upload-license-photo', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload')
      }

      const result = await response.json()

      const newFoto: Foto = {
        url: result.url,
        tipo,
        ordem: tipo === 'FRENTE' ? 1 : tipo === 'VERSO' ? 2 : 99,
      }

      setUploadedFotos(prev => {
        const updated = prev.filter(f => f.tipo !== tipo)
        return [...updated, newFoto]
      })

      toast.success('Foto carregada com sucesso!')
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao carregar foto')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (uploadedFotos.length === 0) {
      toast.error('Por favor, faça upload das fotos primeiro')
      return
    }

    if (!cartaData.numero || !cartaData.nome) {
      toast.error('Número e nome são obrigatórios')
      return
    }

    try {
      const response = await fetch('/api/documents/save-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cartaData,
          fotos: uploadedFotos,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar')
      }

      toast.success('Carta de condução salva com sucesso!')
      setUploadedFotos([])
      setCartaData({})
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar carta de condução')
    }
  }

  const handleDataChange = (field: keyof CartaData, value: any) => {
    setCartaData(prev => ({ ...prev, [field]: value }))
  }

  const removeFoto = (tipo: string) => {
    setUploadedFotos(prev => prev.filter(f => f.tipo !== tipo))
  }

  const getTipoInfo = (tipo: string) => {
    switch (tipo) {
      case 'FRENTE':
        return { icon: <FileText className="w-4 h-4" />, label: 'Frente', color: 'blue' }
      case 'VERSO':
        return { icon: <FileText className="w-4 h-4" />, label: 'Verso', color: 'purple' }
      case 'FOTOGRAFIA':
        return { icon: <User className="w-4 h-4" />, label: 'Fotografia', color: 'green' }
      default:
        return { icon: <Camera className="w-4 h-4" />, label: 'Outra', color: 'gray' }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload de Fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload de Imagens
            </CardTitle>
            <CardDescription>
              Carregue todas as faces da carta de condução
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload de Frente */}
            <div className="space-y-2">
              <Label htmlFor="frente" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Frente
              </Label>
              <div className="relative">
                <Input
                  id="frente"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload('FRENTE', file)
                  }}
                  disabled={loading}
                  className="file:mr-2"
                />
                {uploadedFotos.find(f => f.tipo === 'FRENTE') && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload de Verso */}
            <div className="space-y-2">
              <Label htmlFor="verso" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Verso
              </Label>
              <div className="relative">
                <Input
                  id="verso"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload('VERSO', file)
                  }}
                  disabled={loading}
                  className="file:mr-2"
                />
                {uploadedFotos.find(f => f.tipo === 'VERSO') && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload de Fotografia */}
            <div className="space-y-2">
              <Label htmlFor="fotografia" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Fotografia (Selfie)
              </Label>
              <div className="relative">
                <Input
                  id="fotografia"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload('FOTOGRAFIA', file)
                  }}
                  disabled={loading}
                  className="file:mr-2"
                />
                {uploadedFotos.find(f => f.tipo === 'FOTOGRAFIA') && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Aviso de carregamento */}
            {loading && (
              <div className="text-center py-4 text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Carregando...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visualização das Fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pré-visualização
            </CardTitle>
            <CardDescription>
              Verifique as fotos antes de guardar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFotos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhuma foto carregada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {uploadedFotos.map((foto, index) => {
                  const tipoInfo = getTipoInfo(foto.tipo)
                  return (
                    <div key={index} className="relative group">
                      <div className="aspect-[3/4] rounded-lg border-2 bg-muted/20 overflow-hidden">
                        <img
                          src={foto.url}
                          alt={tipoInfo.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <Badge className={tipoInfo.color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-200' : tipoInfo.color === 'purple' ? 'bg-purple-100 text-purple-700 border-purple-200' : tipoInfo.color === 'green' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700'} variant="secondary">
                          {tipoInfo.label}
                        </Badge>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-6 w-6"
                          onClick={() => removeFoto(foto.tipo)}
                          title="Remover foto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados da Carta */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dados da Carta
            </CardTitle>
            <CardDescription>
              Preencha ou verifique os dados extraídos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={cartaData.numero || ''}
                  onChange={(e) => handleDataChange('numero', e.target.value)}
                  placeholder="Número da carta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={cartaData.categoria || ''}
                  onChange={(e) => handleDataChange('categoria', e.target.value)}
                  placeholder="Ex: B, BE, C, CE"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={cartaData.nome || ''}
                  onChange={(e) => handleDataChange('nome', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apelido">Apelido</Label>
                <Input
                  id="apelido"
                  value={cartaData.apelido || ''}
                  onChange={(e) => handleDataChange('apelido', e.target.value)}
                  placeholder="Último nome"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={cartaData.dataNascimento || ''}
                  onChange={(e) => handleDataChange('dataNascimento', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturalidade">Naturalidade</Label>
                <Input
                  id="naturalidade"
                  value={cartaData.naturalidade || ''}
                  onChange={(e) => handleDataChange('naturalidade', e.target.value)}
                  placeholder="Cidade/Naturalidade"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validade">Validade</Label>
                <Input
                  id="validade"
                  type="date"
                  value={cartaData.validade || ''}
                  onChange={(e) => handleDataChange('validade', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emissao">Data de Emissão</Label>
                <Input
                  id="emissao"
                  type="date"
                  value={cartaData.emissao || ''}
                  onChange={(e) => handleDataChange('emissao', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroRegisto">Número de Registo</Label>
                <Input
                  id="numeroRegisto"
                  value={cartaData.numeroRegisto || ''}
                  onChange={(e) => handleDataChange('numeroRegisto', e.target.value)}
                  placeholder="Número de registo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morada">Morada</Label>
                <Input
                  id="morada"
                  value={cartaData.morada || ''}
                  onChange={(e) => handleDataChange('morada', e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={loading || uploadedFotos.length === 0}
                className="flex-1"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Carta
              </Button>
              <Button
                onClick={() => {
                  setUploadedFotos([])
                  setCartaData({})
                }}
                variant="outline"
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
