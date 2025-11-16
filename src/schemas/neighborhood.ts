import { z } from 'zod'

export const schemaNeighborhood = z.object({
  status: z.string(),
  name: z.string().min(1, 'Informe o nome'),
  city: z.string().min(1, 'Informe a cidade'),
  state: z.string().min(1, 'Informe o estado').max(2, 'Informe apenas o UF')
})
export type NeighborhoodForm = z.infer<typeof schemaNeighborhood>
