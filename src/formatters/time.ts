import type { FormatterConfig, TimeFormat, TimeOptions } from './types'

function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  return new Date(value)
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysDiff(now: Date, then: Date): number {
  const msPerDay = 86_400_000
  return Math.round((startOfDay(now).getTime() - startOfDay(then).getTime()) / msPerDay)
}

export function formatTime(
  value: Date | string | number,
  format: TimeFormat = 'smart',
  config: FormatterConfig,
  opts?: TimeOptions,
): string {
  const date = toDate(value)
  const timezone = opts?.timezone ?? config.timezone
  const locale = config.locale

  const tz: Intl.DateTimeFormatOptions = timezone ? { timeZone: timezone } : {}

  if (format === 'iso') {
    return date.toISOString()
  }

  if (format === 'relative') {
    const ms = Date.now() - date.getTime()
    if (ms < 60_000) return 'just now'
    if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`
    if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`
    if (ms < 7 * 86_400_000) return `${Math.floor(ms / 86_400_000)}d ago`
    // fall back to short for older dates
    return formatTime(value, 'short', config, opts)
  }

  if (format === 'time') {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      ...tz,
    }).format(date)
  }

  if (format === 'short') {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      ...tz,
    }).format(date)
  }

  if (format === 'long') {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      ...tz,
    }).format(date)
  }

  if (format === 'datetime') {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      ...tz,
    }).format(date)
  }

  if (format === 'date') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...tz,
    }).format(date)
  }

  // 'smart' — context-aware based on how long ago
  const now = new Date()
  const diff = daysDiff(now, date)
  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    ...tz,
  }).format(date)

  if (diff === 0) {
    return timeStr
  }

  if (diff === 1) {
    return `Yesterday ${timeStr}`
  }

  if (diff < 7) {
    const weekday = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      ...tz,
    }).format(date)
    return `${weekday} ${timeStr}`
  }

  if (date.getFullYear() === now.getFullYear()) {
    const monthDay = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      ...tz,
    }).format(date)
    return `${monthDay}, ${timeStr}`
  }

  const fullDate = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...tz,
  }).format(date)
  return `${fullDate}, ${timeStr}`
}
