import { z } from 'zod'

export const apiRelationshipType = z.enum([
  'spouse',
  'partner',
  'former_spouse',
  'fiance',
  'boyfriend_girlfriend',
  'parent',
  'child',
  'stepchild',
  'stepparent',
  'sibling',
  'grandparent',
  'grandchild',
  'uncle_aunt',
  'nephew_niece',
  'in_law',
  'guardian',
  'curator',
  'dependent',
  'business_partner',
  'business_partner_admin',
  'shareholder',
  'attorney_in_fact',
  'legal_rep',
  'other'
])

export const schemaRelationship = z.object({
  customer: z.object({
    value: z.string(),
    label: z.string().min(1, 'Informe o cliente que erá vinculado')
  }),
  type: apiRelationshipType,
  marriageDate: z.date('Data do casamento inválida').nullish()
})
export type RelationshipType = z.infer<typeof apiRelationshipType>
export type RelationshipForm = z.infer<typeof schemaRelationship>
