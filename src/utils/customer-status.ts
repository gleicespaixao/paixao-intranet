export type CustomerStatus = 'active' | 'inactive' | 'paused'

type Meta = { label: string; colorPalette: 'green' | 'gray' | 'orange' }

export const CUSTOMER_STATUS_MAP: Record<CustomerStatus, Meta> = {
  active: { label: 'Ativo', colorPalette: 'green' },
  inactive: { label: 'Inativo', colorPalette: 'gray' },
  paused: { label: 'Pausado', colorPalette: 'orange' }
} as const

export function getCustomerStatusMeta(value?: string): Meta {
  const key = (value ?? 'inactive') as CustomerStatus
  return CUSTOMER_STATUS_MAP[key] ?? CUSTOMER_STATUS_MAP.inactive
}

export function translateCustomerStatus(value?: string): string {
  return getCustomerStatusMeta(value).label
}

// opções para <Select>
export const CUSTOMER_STATUS_OPTIONS = (Object.keys(CUSTOMER_STATUS_MAP) as CustomerStatus[]).map((key) => ({
  value: key,
  label: CUSTOMER_STATUS_MAP[key].label
}))
