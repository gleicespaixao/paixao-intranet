// status.ts

type Status = 'active' | 'inactive' // <- string, igual Bedroom

type Meta = { label: string; colorPalette: 'green' | 'gray' }

export const STATUS_MAP: Record<Status, Meta> = {
  active: { label: 'Ativo', colorPalette: 'green' },
  inactive: { label: 'Inativo', colorPalette: 'gray' }
} as const

// opções para <Select>
export const STATUS_OPTIONS = (Object.keys(STATUS_MAP) as Status[]).map((key) => ({
  value: key, // "active" | "inactive"
  label: STATUS_MAP[key].label
}))

// helper pra usar em badges / tabela
export function getStatusMeta(value?: Status | boolean | null): Meta {
  // se vier boolean (da API)
  if (typeof value === 'boolean') {
    return value ? STATUS_MAP.active : STATUS_MAP.inactive
  }

  // se vier string do formulário
  if (value && value in STATUS_MAP) {
    return STATUS_MAP[value as Status]
  }

  return STATUS_MAP.inactive
}
