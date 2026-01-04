import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from 'next-intl/client';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestão de Documentos",
  description: "Extração automática de dados e gestão de ativos",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations(params.locale, 'common');

  return (
    <html lang={params.locale}>
      <body className="antialiased bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          {/* Cabeçalho com Seletor de Idioma */}
          <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight">
                    Sistema de Gestão de Documentos
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {t('app.description')}
                  </p>
                </div>
              </div>
              
              {/* Seletor de Idioma */}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Conteúdo Principal com Provider i18n */}
          <div className="flex-1">
            <NextIntlClientProvider locale={params.locale} messages={t}>
              <Toaster />
              {children}
            </NextIntlClientProvider>
          </div>

          {/* Rodapé (Opcional) */}
          <footer className="border-t border-border/40 bg-muted/40 py-6 mt-auto">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              © 2025 Sistema de Gestão de Documentos. Todos os direitos reservados.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
