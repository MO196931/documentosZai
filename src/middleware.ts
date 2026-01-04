import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

export const dynamic = 'force-dynamic';

// Definições de rotas e idiomas (PT, EN, FR)
const routing = defineRouting({
  // Idiomas disponíveis
  locales: ['pt', 'en', 'fr'],
  
  // Idioma padrão (Português)
  defaultLocale: 'pt',
  
  // Prefixo de URL: 'as-needed' (Cria /pt/, /en/, /fr/...)
});

// Cria middleware
export default createMiddleware(routing);
