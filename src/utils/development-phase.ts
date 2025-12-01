import { apiDevelopmentPhase } from '@/schemas/development'
import type { z } from 'zod'

export type DevelopmentPhase = z.infer<typeof apiDevelopmentPhase>

type Meta = { label: string }

export const DEVELOPMENT_PHASE_MAP: Record<DevelopmentPhase, Meta> = {
  pre_launch: { label: 'Pré-lançamento' },
  launch: { label: 'Lançamento' },
  under_construction: { label: 'Em obra' },
  completed: { label: 'Pronto' }
} as const

// opções para <Select>
export const DEVELOPMENT_PHASE_OPTIONS = (Object.keys(DEVELOPMENT_PHASE_MAP) as DevelopmentPhase[]).map((key) => ({
  value: key,
  label: DEVELOPMENT_PHASE_MAP[key].label
}))
