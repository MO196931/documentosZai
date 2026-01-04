'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Languages, Globe } from 'lucide-react'

// Definição das línguas com Emojis (Bandeiras)
const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

export default function LanguageSwitcher() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-5 h-5 text-muted-foreground" />
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-accent transition-colors">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{pathname.split('/')[1] || 'pt'}</span>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
          <div className="py-1">
            {languages.map((lang) => {
              const isActive = pathname === '/' + lang.code || pathname.startsWith('/' + lang.code)
              
              return (
                <Link 
                  href={'/' + lang.code} 
                  key={lang.code}
                  className={\`flex items-center gap-2 px-4 py-2 transition-colors \${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted hover:text-foreground'}\`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
