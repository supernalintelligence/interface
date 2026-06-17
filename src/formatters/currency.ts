import type { FormatterConfig, CurrencyCode, CurrencyOptions } from './types';

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  config: FormatterConfig,
  opts?: CurrencyOptions
): string {
  const locale = config.locale;
  const currencyDisplay: Intl.NumberFormatOptions['currencyDisplay'] =
    opts?.symbol === 'code'
      ? 'code'
      : opts?.symbol === 'name'
        ? 'name'
        : 'symbol';

  const formatOpts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay,
  };

  if (opts?.compact) {
    formatOpts.notation = 'compact';
    formatOpts.compactDisplay = 'short';
  }

  if (opts?.decimals !== undefined) {
    formatOpts.minimumFractionDigits = opts.decimals;
    formatOpts.maximumFractionDigits = opts.decimals;
  }

  try {
    return new Intl.NumberFormat(locale, formatOpts).format(value);
  } catch (e) {
    if (e instanceof RangeError) {
      console.warn(
        `formatters: invalid currency code "${currency}", falling back to number format`
      );
      return new Intl.NumberFormat(locale).format(value);
    }
    throw e;
  }
}
