'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Camera, X, CheckCircle, AlertCircle, Info, FileText, User, Calendar, MapPin } from 'lucide-react'
import { toast } from 'sonner'

interface Foto {
  url: string
  tipo: string
  ordem?: number
}

interface DocumentoData {
  numero?: string
  nome?: string
  apelido?: string
  dataNascimento?: string
  naturalidade?: string
  nacionalidade?: string
  sexo?: string
  altura?: string
  filiado?: string
  validade?: string
  emissao?: string
  morada?: string
}

export default function DocumentosIdentificacao() {
  const [loading, setLoading] = useState(false)
  const [uploadedFotos, setUploadedFotos] = useState<Foto[]>([])
  const [documentoData, setDocumentoData] = useState<DocumentoData>({
    ativo: true,
  })
  const [selectedTipo, setSelectedTipo] = useState('BI')

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

      const response = await fetch('/api/documents/upload-identity-photo', {
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

      setUploadedFotos(prev => [...prev, newFoto])
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

    try {
      const response = await fetch('/api/documents/save-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...documentoData,
          tipoDocumentoId: selectedTipo,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar documento')
      }

      toast.success('Documento salvo com sucesso!')
      setUploadedFotos([])
      setDocumentoData({ ativo: true })
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar documento')
    }
  }

  const handleDataChange = (field: keyof DocumentoData, value: any) => {
    setDocumentoData(prev => ({ ...prev, [field]: value }))
  }

  const removeFoto = (index: number) => {
    setUploadedFotos(prev => prev.filter((_, i) => i !== index))
  }

  const getTipoIcone = () => {
    switch (selectedTipo) {
      case 'BI':
        return <FileText className="w-4 h-4" />
      case 'Passaporte':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload de Fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload de Imagens
            </CardTitle>
            <CardDescription>
              Carregue frente, verso e fotografia do documento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tipo de Documento</Label>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full p-3 border rounded-lg bg-background"
              >
                <option value="BI">Bilhete de Identidade (BI)</option>
                <option value="Passaporte">Passaporte</option>
                <option value="CartaoCidadao">Cartão de Cidadão</option>
              </select>
            </div>

            {/* Upload de Frente */}
            <div className="space-y-2">
              <Label htmlFor="frente" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Frente do Documento
                <Info className="w-3 h-3 ml-auto text-muted-foreground" />
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
                <Upload className="w-4 h-4" />
                Verso do Documento
                <Info className="w-3 h-3 ml-auto text-muted-foreground" />
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
                <Info className="w-3 h-3 ml-auto text-muted-foreground" />
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
          </CardContent>
        </Card>

        {/* Visualização das Fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Visualização das Imagens
            </CardTitle>
            <CardDescription>
              Pré-visualização antes de guardar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFotos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhuma foto carregada</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {uploadedFotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[3/4] rounded-lg border-2 bg-muted/20 overflow-hidden">
                      <img
                        src={foto.url}
                        alt={foto.tipo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge className="bg-primary text-primary-foreground" variant="secondary">
                        {foto.tipo}
                      </Badge>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-6 w-6"
                        onClick={() => removeFoto(index)}
                        title="Remover foto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados Extraídos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Dados do Documento
            </CardTitle>
            <CardDescription>
              Preencha ou verifique os dados extraídos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={documentoData.numero || ''}
                  onChange={(e) => handleDataChange('numero', e.target.value)}
                  placeholder="Número do documento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={documentoData.nome || ''}
                  onChange={(e) => handleDataChange('nome', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apelido">Apelido</Label>
                <Input
                  id="apelido"
                  value={documentoData.apelido || ''}
                  onChange={(e) => handleDataChange('apelido', e.target.value)}
                  placeholder="Último nome"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={documentoData.dataNascimento || ''}
                  onChange={(e) => handleDataChange('dataNascimento', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="naturalidade">Naturalidade</Label>
                <Input
                  id="naturalidade"
                  value={documentoData.naturalidade || ''}
                  onChange={(e) => handleDataChange('naturalidade', e.target.value)}
                  placeholder="Cidade/Naturalidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Input
                  id="nacionalidade"
                  value={documentoData.nacionalidade || ''}
                  onChange={(e) => handleDataChange('nacionalidade', e.target.value)}
                  placeholder="Nacionalidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <select
                  id="sexo"
                  value={documentoData.sexo || ''}
                  onChange={(e) => handleDataChange('sexo', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="altura">Altura</Label>
                <Input
                  id="altura"
                  value={documentoData.altura || ''}
                  onChange={(e) => handleDataChange('altura', e.target.value)}
                  placeholder="Ex: 1,75m"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="filiado">Filiado (Pai/Mãe)</Label>
                <Input
                  id="filiado"
                  value={documentoData.filiado || ''}
                  onChange={(e) => handleDataChange('filiado', e.target.value)}
                  placeholder="Nomes completos dos pais"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validade">Validade</Label>
                <Input
                  id="validade"
                  type="date"
                  value={documentoData.validade || ''}
                  onChange={(e) => handleDataChange('validade', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emissao">Data de Emissão</Label>
                <Input
                  id="emissao"
                  type="date"
                  value={documentoData.emissao || ''}
                  onChange={(e) => handleDataChange('emissao', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morada">Morada</Label>
                <Input
                  id="morada"
                  value={documentoData.morada || ''}
                  onChange={(e) => handleDataChange('morada', e.target.value)}
                  placeholder="Endereço completo"
              <Button
                onClick={handleSave}
                disabled={loading || uploadedFotos.length === 0}
                className="flex-1"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Documento
              </Button>
              <Button
                onClick={() => {
                  setUploadedFotos([])
                  setDocumentoData({ ativo: true })
                }}
                variant="outline"
              >
                Limpar
              </Button>
            </div>
