import { z } from 'zod'

export const schemaDevelopment = z.object({
  status: z.string(),
  name: z.string().min(1, 'Informe o nome'),
  neighborhood: z.object({
    value: z.string(),
    label: z.string().min(1, 'Informe o bairro do projeto')
  })
})
export type DevelopmentForm = z.infer<typeof schemaDevelopment>
