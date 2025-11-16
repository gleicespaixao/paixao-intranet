import { z } from 'zod'

export const schemaTypeOfProperty = z.object({
  status: z.string(),
  name: z.string().min(1, 'Informe o tipo de propriedade')
})
export type TypeOfPropertyForm = z.infer<typeof schemaTypeOfProperty>
