'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Car, FileSignature, Upload, Users, Bot, Activity } from 'lucide-react'
import DocumentosIdentificacao from '@/components/DocumentosIdentificacao'
import CartasConducao from '@/components/CartasConducao'
import GestaoAtivos from '@/components/GestaoAtivos'
import GeracaoDocumentos from '@/components/GeracaoDocumentos'
import GestaoUtilizadores from '@/components/GestaoUtilizadores'
import GestaoPapeis from '@/components/GestaoPapeis'
import AssistenteJuridico from '@/components/AssistenteJuridico'
import AutoHealDashboard from '@/components/AutoHealDashboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Sistema de Gestão de Documentos
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Extração automática de dados e gestão de ativos
              </p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="documentos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 mb-6 h-auto p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger
              value="documentos"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Documentos</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger
              value="cartas"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Cartas</span>
              <span className="sm:hidden">Cartas</span>
            </TabsTrigger>
            <TabsTrigger
              value="ativos"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <Car className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ativos</span>
              <span className="sm:hidden">Ativos</span>
            </TabsTrigger>
            <TabsTrigger
              value="geracao"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <FileSignature className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Gerar Docs</span>
              <span className="sm:hidden">Gerar</span>
            </TabsTrigger>
            <TabsTrigger
              value="assistente"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <Bot className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Assistente Jurídico</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger
              value="autoheal"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <Activity className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Auto-Cura</span>
              <span className="sm:hidden">Heal</span>
            </TabsTrigger>
            <TabsTrigger
              value="utilizadores"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Utilizadores</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documentos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Documentos de Identificação</CardTitle>
                <CardDescription>
                  Faça upload de documentos de identificação para extração automática de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentosIdentificacao />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cartas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cartas de Condução</CardTitle>
                <CardDescription>
                  Faça upload de cartas de condução para extração automática de dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CartasConducao />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ativos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Gestão de Ativos</CardTitle>
                <CardDescription>
                  Crie e gerencie ativos disponíveis para aluguel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GestaoAtivos />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geracao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Geração de Documentos</CardTitle>
                <CardDescription>
                  Crie templates e gere documentos preenchidos automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeracaoDocumentos />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistente" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Assistente Jurídico</CardTitle>
                <CardDescription>
                  Obtenha ajuda para criar e melhorar templates de documentos legais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssistenteJuridico />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="autoheal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Sistema de Auto-Cura</CardTitle>
                <CardDescription>
                  Monitorização inteligente e correções automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoHealDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="utilizadores" className="space-y-6">
            <Tabs defaultValue="gestao-utilizadores" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="gestao-utilizadores">Gestão de Utilizadores</TabsTrigger>
                <TabsTrigger value="gestao-papeis">Gestão de Papéis</TabsTrigger>
              </TabsList>

              <TabsContent value="gestao-utilizadores">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Gestão de Utilizadores</CardTitle>
                    <CardDescription>
                      Crie, edite e gerencie utilizadores do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GestaoUtilizadores />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gestao-papeis">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Gestão de Papéis</CardTitle>
                    <CardDescription>
                      Crie e gerencie os papéis do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GestaoPapeis />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
