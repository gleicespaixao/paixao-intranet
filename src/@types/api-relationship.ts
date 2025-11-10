import { ApiItemLinks, ApiLog } from './utils'

export type ApiRelationshipType =
  | 'spouse'
  | 'partner'
  | 'former_spouse'
  | 'fiance'
  | 'boyfriend_girlfriend'
  | 'parent'
  | 'child'
  | 'stepchild'
  | 'stepparent'
  | 'sibling'
  | 'grandparent'
  | 'grandchild'
  | 'uncle_aunt'
  | 'nephew_niece'
  | 'in_law'
  | 'guardian'
  | 'curator'
  | 'dependent'
  | 'business_partner'
  | 'business_partner_admin'
  | 'shareholder'
  | 'attorney_in_fact'
  | 'legal_rep'
  | 'other'

export type ApiRelationship = {
  id: string
  token: number
  customer: ApiItemLinks[]
  type: ApiRelationshipType
  marriageDate: string
  logs: ApiLog
}
