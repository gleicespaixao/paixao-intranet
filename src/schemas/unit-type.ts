import { z } from 'zod'

export const schemaUnitType = z.object({
  status: z.string(),
  name: z.string().min(1, 'Informe o nome')
})
export type UnitTypeForm = z.infer<typeof schemaUnitType>
