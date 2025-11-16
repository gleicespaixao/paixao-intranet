// API (number) -> "350.000,50"
export const formatBrCurrencyFromNumber = (amount?: number | null): string => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return ''
  }

  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// "R$ 350.000,50" | "350.000,50" | "350000,50" | "350000.50" -> 350000.5
export const parseBrCurrencyToNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return 0

  let clean = value.replace(/[^\d.,-]/g, '')
  if (!clean) return 0

  const hasComma = clean.includes(',')
  const hasDot = clean.includes('.')

  if (hasComma && hasDot) {
    // "350.000,50" -> "350000,50" -> "350000.50"
    clean = clean.replace(/\./g, '').replace(',', '.')
    return Number(clean)
  }

  if (hasComma && !hasDot) {
    // "350000,50" -> "350000.50"
    clean = clean.replace(',', '.')
    return Number(clean)
  }

  return Number(clean)
}
