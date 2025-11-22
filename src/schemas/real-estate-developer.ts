import { z } from 'zod'

export const schemaRealEstateDeveloper = z.object({
  status: z.string(),
  name: z.string().min(1, 'Informe o nome')
})
export type RealEstateDeveloperForm = z.infer<typeof schemaRealEstateDeveloper>
