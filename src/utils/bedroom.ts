import { apiBedrooms } from '@/schemas/customer'
import type { z } from 'zod'

export type Bedroom = z.infer<typeof apiBedrooms>

type Meta = { label: string }

export const BEDROOM_MAP: Record<Bedroom, Meta> = {
  none: { label: 'Sem preferência' },
  one: { label: '1' },
  two: { label: '2' },
  three: { label: '3' },
  four_plus: { label: 'Mais de 4' }
} as const

// opções para <Select>
export const BEDROOM_OPTIONS = (Object.keys(BEDROOM_MAP) as Bedroom[]).map((key) => ({
  value: key,
  label: BEDROOM_MAP[key].label
}))
