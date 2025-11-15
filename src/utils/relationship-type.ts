import { apiRelationshipType } from '@/schemas/relationship'
import type { z } from 'zod'

export type RelationshipType = z.infer<typeof apiRelationshipType>

type Meta = { label: string }

export const RELATIONSHIP_TYPE_MAP: Record<RelationshipType, Meta> = {
  spouse: { label: 'Cônjuge' },
  partner: { label: 'Companheiro(a)' },
  former_spouse: { label: 'Ex-cônjuge' },
  fiance: { label: 'Noivo(a)' },
  boyfriend_girlfriend: { label: 'Namorado(a)' },
  parent: { label: 'Pai/Mãe' },
  child: { label: 'Filho(a)' },
  stepchild: { label: 'Enteado(a)' },
  stepparent: { label: 'Padrasto/Madrasta' },
  sibling: { label: 'Irmão(ã)' },
  grandparent: { label: 'Avô(ó)' },
  grandchild: { label: 'Neto(a)' },
  uncle_aunt: { label: 'Tio(a)' },
  nephew_niece: { label: 'Sobrinho(a)' },
  in_law: { label: 'Parente por afinidade' },
  guardian: { label: 'Guardião(ã)' },
  curator: { label: 'Curador(a)' },
  dependent: { label: 'Dependente' },
  business_partner: { label: 'Sócio(a)' },
  business_partner_admin: { label: 'Sócio(a)-administrador(a)' },
  shareholder: { label: 'Acionista' },
  attorney_in_fact: { label: 'Procurador(a)' },
  legal_rep: { label: 'Representante legal' },
  other: { label: 'Outro' }
} as const

// opções para <Select>
export const RELATIONSHIP_TYPE_OPTIONS = (Object.keys(RELATIONSHIP_TYPE_MAP) as RelationshipType[]).map((key) => ({
  value: key,
  label: RELATIONSHIP_TYPE_MAP[key].label
}))
