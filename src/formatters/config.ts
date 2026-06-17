import type { FormatterConfig } from './types'

export const DEFAULT_CONFIG: FormatterConfig = {
  locale: 'en-US',
  timezone: undefined,
  currency: 'USD',
}

// Map from supernal locale codes to BCP 47 tags + default currency
export const LOCALE_MAP: Record<string, Partial<FormatterConfig>> = {
  en:  { locale: 'en-US',  currency: 'USD' },
  es:  { locale: 'es-ES',  currency: 'EUR' },
  fr:  { locale: 'fr-FR',  currency: 'EUR' },
  tr:  { locale: 'tr-TR',  currency: 'TRY' },
  fa:  { locale: 'fa-IR',  currency: 'IRR' },
  zh:  { locale: 'zh-CN',  currency: 'CNY' },
}

export function resolveLocaleConfig(lang: string): Partial<FormatterConfig> {
  return LOCALE_MAP[lang] ?? LOCALE_MAP['en']!
}
