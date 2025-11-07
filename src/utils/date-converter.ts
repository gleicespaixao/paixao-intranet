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
