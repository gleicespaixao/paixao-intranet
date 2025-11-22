import { z } from 'zod'

export const schemaDevelopment = z.object({
  status: z.string(),
  name: z.string().min(2, 'Informe o nome'),
  neighborhood: z.object({
    value: z.string(),
    label: z.string().min(1, 'Informe o bairro do projeto')
  }),
  realEstateDeveloper: z.string().min(2, 'Informe a Incorporadora')
})
export type DevelopmentForm = z.infer<typeof schemaDevelopment>
