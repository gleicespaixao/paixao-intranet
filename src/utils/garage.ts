import { apiGarages } from '@/schemas/customer'
import type { z } from 'zod'

export type Garage = z.infer<typeof apiGarages>

type Meta = { label: string }

export const GARAGE_MAP: Record<Garage, Meta> = {
  none: { label: 'Sem preferência' },
  one: { label: '1' },
  two: { label: '2' },
  three: { label: '3' },
  four_plus: { label: 'Mais de 4' }
} as const

// opções para <Select>
export const GARAGE_OPTIONS = (Object.keys(GARAGE_MAP) as Garage[]).map((key) => ({
  value: key,
  label: GARAGE_MAP[key].label
}))
