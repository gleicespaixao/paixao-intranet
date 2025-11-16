import z from 'zod'
import { internationalPhoneRegex } from './utils'

export const schemaUserSimple = z.object({
  name: z.string().min(3, 'Informe seu nome'),
  surname: z.string().min(3, 'Informe seu sobrenome'),
  email: z.string().email('E-mail inválido'),
  dateBirth: z.date('Data de nascimento inválida'),
  phone: z
    .string()
    .min(8, 'Número de telefone inválido')
    .refine((val) => internationalPhoneRegex.test(val.replace(/[()\s-]/g, '')), {
      message: 'Número de telefone inválido'
    })
})

export type UserSimpleForm = z.infer<typeof schemaUserSimple>
