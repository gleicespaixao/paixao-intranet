export function dateConverter(date: string, type: 'international' | 'brazil') {
  if (type === 'brazil') {
    const [year, month, day] = date.split('-')
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  const [day, month, year] = date.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function formatNotificationDate(input: string | number | Date) {
  const date = toDate(input)

  if (!date) return ''

  const datePart = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)

  const timePart = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return `${cap(datePart)} às ${timePart}`
}

const TZ = 'America/Sao_Paulo' as const
const LOCALE = 'pt-BR' as const

export type DateInput = string | number | Date | null | undefined

function toDate(input: DateInput): Date | null {
  if (input == null) return null

  // já é Date
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input
  }

  // string
  if (typeof input === 'string') {
    const trimmed = input.trim()

    // "YYYY-MM-DD" → tratar como data local
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split('-').map(Number)
      const date = new Date(y, m - 1, d)
      return Number.isNaN(date.getTime()) ? null : date
    }

    // "DD/MM/YYYY" → também como data local (se você usar esse formato)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      return Number.isNaN(date.getTime()) ? null : date
    }

    // outras strings (ISO completo etc.)
    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  // number (timestamp)
  if (typeof input === 'number') {
    const date = new Date(input)
    return Number.isNaN(date.getTime()) ? null : date
  }

  // fallback de segurança (não deve chegar aqui com o tipo atual)
  return null
}

const fmtShort = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

const fmtLong = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

/** Ex.: 21/12/2023 */
export function formatDateShort(input: DateInput): string {
  const d = toDate(input)
  return d ? fmtShort.format(d) : ''
}

/** Ex.: 17 de agosto de 2020, 15:48:20 */
export function formatDateLong(input: DateInput): string {
  const d = toDate(input)
  return d ? fmtLong.format(d) : ''
}
