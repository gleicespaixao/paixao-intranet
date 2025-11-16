import { z } from 'zod'
import { internationalPhoneRegex, isValidCNPJ } from './utils'

export const schemaCompanyBase = z.object({
  name: z.string().min(3, 'Nome é obrigatório').max(120, 'Máximo de 120 caracteres'),
  phone: z
    .string()
    .min(8, 'Número de telefone inválido')
    .refine((val) => internationalPhoneRegex.test(val.replace(/[()\s-]/g, '')), {
      message: 'Número de telefone inválido'
    }),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  cnpj: z
    .string()
    .min(3, 'CNPJ é obrigatório')
    .refine((val) => !val || isValidCNPJ(val), {
      message: 'CNPJ inválido'
    }),
  address: z.object({
    postalCode: z.string().optional(),
    street: z.string().optional(),
    addressLine: z.string().optional(),
    streetNumber: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional()
  })
})

export const schemaCompany = schemaCompanyBase.refine(
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

export type CompanyForm = z.infer<typeof schemaCompany>

export const schemaCompanyCustomer = z.object({
  company: z.object({
    value: z.string(),
    label: z.string().min(1, 'Informe a empresa que erá vinculada ao cliente')
  })
})

export type CompanyCustomerForm = z.infer<typeof schemaCompanyCustomer>
