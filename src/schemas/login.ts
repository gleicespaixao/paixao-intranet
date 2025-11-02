import { z } from 'zod'

export const schemaLogin = z.object({
  identifier: z.string().min(1, 'Informe usuário ou e-mail').trim(),
  password: z.string().min(1, 'Informe a senha')
})

export type LoginForm = z.infer<typeof schemaLogin>
