import { ApiDevelopmentPhase } from '@/schemas/development'
import { ApiAddress, ApiItemLinks, ApiLog } from './utils'

export type ApiDevelopment = {
  id: string
  token: number
  realEstateDeveloper: ApiItemLinks[]
  name: string
  phase: ApiDevelopmentPhase
  releaseDate: string | null

  technicalSpecifications: {
    floorPlan: string
    leisure?: ApiItemLinks[]
  }

  projectTeam: {
    architecture: string
    interiorDesign: string
    landscaping: string
  }

  distance: string[]

  typology: {
    studio: { quantity: number; floorPlan: string }
    one_bedroom: { quantity: number; floorPlan: string }
    two_bedroom: { quantity: number; floorPlan: string }
    three_bedroom: { quantity: number; floorPlan: string }
    four_bedroom: { quantity: number; floorPlan: string }
  }

  address: ApiAddress
  status: boolean
  logs: ApiLog
}

export type ApiDevelopmentCreateUpdate = {
  realEstateDeveloper: { id: string }[]
  name: string
  phase: ApiDevelopmentPhase
  releaseDate?: string

  technicalSpecifications: {
    floorPlan?: string | null
    leisure?: { id: string }[]
  }

  projectTeam: {
    architecture?: string | null
    interiorDesign?: string | null
    landscaping?: string | null
  }

  typology: {
    studio: { quantity: number; floorPlan?: string }
    one_bedroom: { quantity: number; floorPlan?: string }
    two_bedroom: { quantity: number; floorPlan?: string }
    three_bedroom: { quantity: number; floorPlan?: string }
    four_bedroom: { quantity: number; floorPlan?: string }
  }

  distance?: string[]

  address: {
    postalCode?: string
    street?: string
    addressLine2?: string
    streetNumber?: string
    neighborhood?: string
    city?: string
    state?: string
  } | null
  status: boolean
}
