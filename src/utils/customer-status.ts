type Status = 'active' | 'inactive' | 'paused'

type Meta = { label: string; colorPalette: 'green' | 'gray' | 'orange' }

export const CUSTOMER_STATUS_MAP: Record<Status, Meta> = {
  active: { label: 'Ativo', colorPalette: 'green' },
  inactive: { label: 'Inativo', colorPalette: 'gray' },
  paused: { label: 'Pausado', colorPalette: 'orange' }
} as const

// opções para <Select>
export const CUSTOMER_STATUS_OPTIONS = (Object.keys(CUSTOMER_STATUS_MAP) as Status[]).map((key) => ({
  value: key, // "active" | "inactive"
  label: CUSTOMER_STATUS_MAP[key].label
}))

// helper pra usar em badges / tabela
export function getCustomerStatusMeta(value?: Status | null): Meta {
  // se vier string do formulário
  if (value && value in CUSTOMER_STATUS_MAP) {
    return CUSTOMER_STATUS_MAP[value as Status]
  }

  return CUSTOMER_STATUS_MAP.inactive
}
