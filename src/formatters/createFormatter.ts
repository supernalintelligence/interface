import type { FormatterConfig, Formatter, TimeFormat, CurrencyCode, TimeOptions, CurrencyOptions, NumberOptions } from './types'
import { DEFAULT_CONFIG } from './config'
import { formatTime } from './time'
import { formatCurrency } from './currency'
import { formatNumber } from './number'

export function createFormatter(config: Partial<FormatterConfig> = {}): Formatter {
  const resolved: FormatterConfig = { ...DEFAULT_CONFIG, ...config }
  return {
    config: resolved,
    time: (value: Date | string | number, format: TimeFormat = 'smart', opts?: TimeOptions) =>
      formatTime(value, format, resolved, opts),
    currency: (value: number, currency?: CurrencyCode, opts?: CurrencyOptions) =>
      formatCurrency(value, currency ?? resolved.currency ?? 'USD', resolved, opts),
    number: (value: number, opts?: NumberOptions) =>
      formatNumber(value, resolved, opts),
  }
}
