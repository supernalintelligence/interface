import type { FormatterConfig, NumberOptions } from './types'

export function formatNumber(
  value: number,
  config: FormatterConfig,
  opts?: NumberOptions,
): string {
  const locale = config.locale

  const formatOpts: Intl.NumberFormatOptions = {
    style: opts?.style ?? 'decimal',
  }

  if (opts?.compact) {
    formatOpts.notation = 'compact'
    formatOpts.compactDisplay = 'short'
  }

  if (opts?.decimals !== undefined) {
    formatOpts.minimumFractionDigits = opts.decimals
    formatOpts.maximumFractionDigits = opts.decimals
  }

  return new Intl.NumberFormat(locale, formatOpts).format(value)
}
