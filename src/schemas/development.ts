import { z } from 'zod'

export const apiDevelopmentPhase = z.enum(['pre_launch', 'launch', 'under_construction', 'completed'])

export const schemaDevelopment = z.object({
  status: z.string(),
  name: z.string().min(2, 'Informe o nome'),
  phase: apiDevelopmentPhase,
  realEstateDeveloper: z
    .array(
      z.object({
        value: z.string().min(1, 'Informe uma incorporadora'),
        label: z.string()
      })
    )
    .min(1, 'Informe pelo menos uma incorporadora'),
  releaseDate: z.date('Data de nascimento inválida').nullish(),

  technicalSpecifications: z.object({
    floorPlan: z.string().optional(),
    leisure: z.array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    )
  }),
  projectTeam: z.object({
    architecture: z.string().optional(),
    interiorDesign: z.string().optional(),
    landscaping: z.string().optional()
  }),

  distance: z.array(
    z.object({
      distance: z.string().optional()
    })
  ),

  typology: z.object({
    studio: z.object({
      quantity: z.number().min(0, 'Informe a quantidade'),
      floorPlan: z.string().optional()
    }),
    one_bedroom: z.object({
      quantity: z.number().min(0, 'Informe a quantidade'),
      floorPlan: z.string().optional()
    }),
    two_bedroom: z.object({
      quantity: z.number().min(0, 'Informe a quantidade'),
      floorPlan: z.string().optional()
    }),
    three_bedroom: z.object({
      quantity: z.number().min(0, 'Informe a quantidade'),
      floorPlan: z.string().optional()
    }),
    four_bedroom: z.object({
      quantity: z.number().min(0, 'Informe a quantidade'),
      floorPlan: z.string().optional()
    })
  }),

  address: z.object({
    postalCode: z.string('Informe o CEP'),
    street: z.string('Informe a rua/avenida'),
    addressLine: z.string().optional(),
    streetNumber: z.string().optional(),
    neighborhood: z.string('Informe o Bairro'),
    city: z.string('Informe a Cidade'),
    state: z.string('Informe o Estado')
  })
})
export type DevelopmentForm = z.infer<typeof schemaDevelopment>
export type ApiDevelopmentPhase = z.infer<typeof apiDevelopmentPhase>
