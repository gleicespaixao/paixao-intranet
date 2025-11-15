import { RelationshipType } from '@/schemas/relationship'
import { ApiItemLinks, ApiLog } from './utils'

export type ApiRelationshipType = RelationshipType

export type ApiRelationship = {
  id: string
  token: number
  customer: ApiItemLinks[]
  type: ApiRelationshipType
  marriageDate: string
  logs: ApiLog
}

export type ApiRelationshipCreateUpdate = {
  customer: { id: string }[]
  type: ApiRelationshipType
  marriageDate: string | null
}
