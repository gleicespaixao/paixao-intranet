import { z } from 'zod'
import { internationalPhoneRegex, isValidCPF } from './utils'

export const apiCustomerStatus = z.enum(['active', 'inactive', 'paused'])
export const apiCustomerMarital = z.enum(['single', 'married', 'separated', 'divorced', 'widowed', 'other'])
export const apiPurchaseGoals = z.enum(['none', 'residence', 'investment'])
export const apiBedrooms = z.enum(['none', 'one', 'two', 'three', 'four_plus'])
export const apiGarages = z.enum(['none', 'one', 'two', 'three', 'four_plus'])

export const schemaCustomerBase = z.object({
  status: apiCustomerStatus,
  name: z.string().min(3, 'Nome é obrigatório').max(120, 'Máximo de 120 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  rg: z.string().optional(),
  cpf: z
    .string()
    .optional()
    .refine((val) => !val || isValidCPF(val), {
      message: 'CPF inválido'
    }),
  dateBirth: z.date('Data de nascimento inválida').nullish(),
  phone: z
    .string()
    .min(8, 'Número de telefone inválido')
    .refine((val) => internationalPhoneRegex.test(val.replace(/[()\s-]/g, '')), {
      message: 'Número de telefone inválido'
    }),

  profession: z.string().optional(),
  maritalStatus: apiCustomerMarital,
  address: z.object({
    postalCode: z.string().optional(),
    street: z.string().optional(),
    addressLine: z.string().optional(),
    streetNumber: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional()
  }),
  propertyProfile: z.object({
    purchaseGoals: z
      .array(
        z.object({
          value: apiPurchaseGoals,
          label: z.string()
        })
      )
      .optional(),
    neighborhood: z.array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    ),
    typeOfProperty: z.array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    ),
    bedrooms: z
      .array(
        z.object({
          value: apiBedrooms,
          label: z.string()
        })
      )
      .optional(),
    garage: z
      .array(
        z.object({
          value: apiGarages,
          label: z.string()
        })
      )
      .optional()
  })
})

export const schemaCustomer = schemaCustomerBase.refine(
  (data) => {
    const hasEmail = !!data.email && data.email !== ''
    const hasPhone = !!data.phone && data.phone !== ''
    return hasEmail || hasPhone
  },
  {
    message: 'Informe pelo menos e-mail ou telefone',
    path: ['email']
  }
)

export type CustomerForm = z.infer<typeof schemaCustomer>
export type ApiCustomerStatus = z.infer<typeof apiCustomerStatus>
export type ApiPurchaseGoals = z.infer<typeof apiPurchaseGoals>
export type ApiBedrooms = z.infer<typeof apiBedrooms>
export type ApiGarages = z.infer<typeof apiGarages>
