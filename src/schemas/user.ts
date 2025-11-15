import z from 'zod'
import { phoneRegex, validDdds } from './utils'

export const schemaUserSimple = z.object({
  name: z.string().min(3, 'Informe seu nome'),
  surname: z.string().min(3, 'Informe seu sobrenome'),
  email: z.string().email('E-mail inválido'),
  dateBirth: z.date('Data de nascimento inválida'),
  phone: z
    .string()
    .regex(phoneRegex, 'Número de telefone inválido')
    .regex(phoneRegex, 'Número de telefone inválido')
    .refine(
      (val) => {
        const ddd = val.match(/\((\d{2})\)/)?.[1]
        return ddd ? validDdds.includes(ddd) : false
      },
      {
        message: 'DDD inválido'
      }
    )
})
export type UserSimpleForm = z.infer<typeof schemaUserSimple>
