export type TimeFormat =
  | 'relative'   // "2 hours ago", "just now", "3d ago"
  | 'smart'      // "4:24 PM" / "Yesterday 4:24 PM" / "Mon 4:24 PM" / "Jun 17, 4:24 PM"
  | 'short'      // "Jun 17"
  | 'long'       // "June 17, 2026"
  | 'datetime'   // "Jun 17, 4:24 PM"
  | 'time'       // "4:24 PM"
  | 'date'       // "06/17/2026" (locale-aware)
  | 'iso'        // passthrough ISO string

export type CurrencyCode = string  // 'USD', 'TRY', 'EUR', etc.

export interface TimeOptions {
  timezone?: string
}

export interface CurrencyOptions {
  compact?: boolean         // "$1.2K", "₺2.5M"
  decimals?: number         // override decimal places
  symbol?: 'symbol' | 'code' | 'name'  // '$' vs 'USD' vs 'US dollars'
}

export interface NumberOptions {
  compact?: boolean         // "1.2M", "500K"
  decimals?: number
  style?: 'decimal' | 'percent'
}

export interface FormatterConfig {
  locale: string            // BCP 47 locale tag e.g. "en-US", "tr-TR", "fa-IR"
  timezone?: string         // IANA timezone e.g. "America/New_York", "Europe/Istanbul"
  currency?: CurrencyCode   // default currency for the context
}

export interface Formatter {
  time(value: Date | string | number, format?: TimeFormat, opts?: TimeOptions): string
  currency(value: number, currency?: CurrencyCode, opts?: CurrencyOptions): string
  number(value: number, opts?: NumberOptions): string
  config: FormatterConfig
}
