import { z } from 'zod'

export const schemaLeisure = z.object({
  status: z.string(),
  name: z.string().min(1, 'Informe o nome')
})
export type LeisureForm = z.infer<typeof schemaLeisure>
