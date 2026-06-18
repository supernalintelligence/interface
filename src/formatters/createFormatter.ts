import type {
  FormatterConfig,
  Formatter,
  TimeFormat,
  CurrencyCode,
  TimeOptions,
  CurrencyOptions,
  NumberOptions,
} from './types';
import { DEFAULT_CONFIG } from './config';
import { formatTime } from './time';
import { formatCurrency } from './currency';
import { formatNumber } from './number';

function resolveTimeZone(tz?: string): string | undefined {
  if (!tz) return undefined;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    console.warn(`formatters: invalid timezone "${tz}", ignoring`);
    return undefined;
  }
}

export function createFormatter(
  config: Partial<FormatterConfig> = {}
): Formatter {
  const merged: FormatterConfig = { ...DEFAULT_CONFIG, ...config };
  const resolved: FormatterConfig = {
    ...merged,
    timezone: resolveTimeZone(merged.timezone),
  };
  return {
    config: resolved,
    time: (
      value: Date | string | number,
      format: TimeFormat = 'smart',
      opts?: TimeOptions
    ) => formatTime(value, format, resolved, opts),
    currency: (
      value: number,
      currency?: CurrencyCode,
      opts?: CurrencyOptions
    ) =>
      formatCurrency(
        value,
        currency ?? resolved.currency ?? 'USD',
        resolved,
        opts
      ),
    number: (value: number, opts?: NumberOptions) =>
      formatNumber(value, resolved, opts),
  };
}
