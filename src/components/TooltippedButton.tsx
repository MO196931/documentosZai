'use client'

import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LucideIcon } from 'lucide-react'

interface TooltippedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string
  description?: string
  children: React.ReactNode
  icon?: LucideIcon
}

export function TooltippedButton({
  tooltip,
  description,
  children,
  icon,
  className = '',
  ...props
}: TooltippedButtonProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`
              ${className}
              relative group
              inline-flex items-center gap-2
              px-3 py-2
              rounded-md
              text-sm font-medium
              transition-colors
              hover:bg-accent
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              disabled:opacity-50
            `}
            {...props}
          >
            {children}
            {icon && (
              <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {React.createElement(icon, { className: 'w-3 h-3' })}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side="top" align="start">
          <div className="space-y-1">
            <p className="font-medium text-foreground">{tooltip}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface TooltippedElementProps {
  children: React.ReactNode
  tooltip: string
  description?: string
  className?: string
}

export function TooltippedElement({
  children,
  tooltip,
  description,
  className = '',
}: TooltippedElementProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-block ${className}`}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side="top" align="center">
          <div className="space-y-1">
            <p className="font-medium text-foreground">{tooltip}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
