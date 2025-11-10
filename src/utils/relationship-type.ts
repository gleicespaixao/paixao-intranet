import { ApiRelationshipType } from '@/@types/api-relationship'

export const RELATIONSHIP_TYPE_LABEL: Record<ApiRelationshipType, string> = {
  spouse: 'Cônjuge',
  partner: 'Companheiro(a)',
  former_spouse: 'Ex-cônjuge',
  fiance: 'Noivo(a)',
  boyfriend_girlfriend: 'Namorado(a)',
  parent: 'Pai/Mãe',
  child: 'Filho(a)',
  stepchild: 'Enteado(a)',
  stepparent: 'Padrasto/Madrasta',
  sibling: 'Irmão(ã)',
  grandparent: 'Avô(ó)',
  grandchild: 'Neto(a)',
  uncle_aunt: 'Tio(a)',
  nephew_niece: 'Sobrinho(a)',
  in_law: 'Parente por afinidade',
  guardian: 'Guardião(ã)',
  curator: 'Curador(a)',
  dependent: 'Dependente',
  business_partner: 'Sócio(a)',
  business_partner_admin: 'Sócio(a)-administrador(a)',
  shareholder: 'Acionista',
  attorney_in_fact: 'Procurador(a)',
  legal_rep: 'Representante legal',
  other: 'Outro'
} as const

export function translateRelationshipType(t: ApiRelationshipType): string {
  return RELATIONSHIP_TYPE_LABEL[t]
}
