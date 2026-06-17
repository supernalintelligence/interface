import { useMemo } from 'react'
import { createFormatter } from '../createFormatter'
import { resolveLocaleConfig } from '../config'
import type { Formatter } from '../types'

// Matches the shape returned by useLanguage() in LanguageContext.tsx
interface LanguageContextValue {
  language: string
  timezone?: string
}

// Dynamic import-safe: accepts the context value directly
export function createFormatterFromContext(ctx: LanguageContextValue): Formatter {
  const localeConfig = resolveLocaleConfig(ctx.language)
  return createFormatter({
    ...localeConfig,
    timezone: ctx.timezone,
  })
}

// The hook — reads from LanguageContext
// We import LanguageContext dynamically to keep this file tree-shakeable
// and avoid circular deps if formatters are used in the context itself.
// Consumers in the dashboard pass the context value directly.
export function useFormatter(ctx: LanguageContextValue): Formatter {
  return useMemo(() => createFormatterFromContext(ctx), [ctx.language, ctx.timezone])
}
