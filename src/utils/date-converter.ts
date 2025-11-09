export function dateConverter(date: string, type: 'international' | 'brazil') {
  if (type === 'brazil') {
    const [year, month, day] = date.split('-')
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  const [day, month, year] = date.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function formatNotificationDate(input: string | number | Date) {
  const hasTime = typeof input === 'string' && /T\d{2}:\d{2}/.test(input)
  const date = typeof input === 'string' && !hasTime ? new Date(`${input}T00:00:00`) : new Date(input)

  const datePart = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)

  const timePart = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)

  // Capitaliza "quarta-feira" -> "Quarta-feira"
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return `${cap(datePart)} às ${timePart}`
}

const TZ = 'America/Sao_Paulo' as const
const LOCALE = 'pt-BR' as const

type DateInput = string | number | Date | null | undefined

function toDate(input: DateInput): Date | null {
  if (input == null) return null
  const d = input instanceof Date ? input : new Date(input)
  return Number.isNaN(d.getTime()) ? null : d
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
