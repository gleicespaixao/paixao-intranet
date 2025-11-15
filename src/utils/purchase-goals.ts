import { apiPurchaseGoals } from '@/schemas/customer'
import z from 'zod'

export type PurchaseGoals = z.infer<typeof apiPurchaseGoals>

type Meta = { label: string }

export const PURCHASE_GOALS_MAP: Record<PurchaseGoals, Meta> = {
  none: { label: 'Sem preferência' },
  residence: { label: 'Moradia' },
  investment: { label: 'Investimento' }
} as const

// opções para <Select>
export const PURCHASE_GOALS_OPTIONS = (Object.keys(PURCHASE_GOALS_MAP) as PurchaseGoals[]).map((key) => ({
  value: key,
  label: PURCHASE_GOALS_MAP[key].label
}))
