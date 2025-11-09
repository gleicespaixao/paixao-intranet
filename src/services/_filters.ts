export type Op = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'

/** Escape e formata o valor para a API (número/boolean cru; string entre aspas) */
export function fmtValue(v: unknown): string {
  if (v == null) return '""' // ajuste se sua API tratar null/empty diferente
  if (typeof v === 'number' || typeof v === 'bigint') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  const s = String(v)
  const escaped = s.replace(/"/g, '\\"')
  return `"${escaped}"`
}

/** Um filtro simples: field op value → "field op value" */
export function cond(field: string, op: Op, value: unknown): string {
  return `${field} ${op} ${fmtValue(value)}`
}

/** Filtro de busca "like" em vários campos: "name|email lk termo" */
export function like(fields: string[], term?: string): string | undefined {
  const t = term?.trim()
  if (!t) return undefined
  if (!fields.length) return undefined
  return `${fields.join('|')} lk ${fmtValue(t)}`
}

/** Junta filtros com vírgula, ignorando vazios/undefined */
export function joinFilters(parts: Array<string | undefined | null>): string | undefined {
  const items = parts.filter((p): p is string => !!p && p.trim().length > 0)
  return items.length ? items.join(',') : undefined
}
