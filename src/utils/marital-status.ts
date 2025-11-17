export type MaritalStatus = 'single' | 'married' | 'separated' | 'divorced' | 'widowed' | 'other'

type Meta = { label: string; colorPalette: 'blue' | 'green' | 'orange' | 'purple' | 'gray' | 'pink' }

const MARITAL_STATUS_MAP: Record<MaritalStatus, Meta> = {
  single: { label: 'Solteiro', colorPalette: 'green' },
  married: { label: 'Casado', colorPalette: 'blue' },
  separated: { label: 'Separado', colorPalette: 'orange' },
  divorced: { label: 'Separado', colorPalette: 'pink' },
  widowed: { label: 'Viúvo', colorPalette: 'purple' },
  other: { label: 'Outro', colorPalette: 'gray' }
} as const

/** Tradução + metadados. Desconhecidos viram 'other'. */
export function getMaritalStatusMeta(value?: string): Meta {
  if (!value) return MARITAL_STATUS_MAP.other
  const key = value as MaritalStatus
  return MARITAL_STATUS_MAP[key] ?? MARITAL_STATUS_MAP.other
}

/** Só o rótulo (caso precise em inputs/selects) */
export function translateMaritalStatus(value?: string): string {
  return getMaritalStatusMeta(value).label
}
// 👉 gera opções para selects
export const MARITAL_STATUS_OPTIONS = (Object.keys(MARITAL_STATUS_MAP) as MaritalStatus[]).map((key) => ({
  value: key,
  label: MARITAL_STATUS_MAP[key].label
}))
