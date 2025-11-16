import { z } from 'zod'

export const schemaPurchaseHistory = z
  .object({
    development: z.object({
      value: z.string().min(1, 'Informe um projeto'),
      label: z.string()
    }),
    unit: z.string().min(1, 'Informe a unidade'),
    floorPlan: z.string().optional(),
    amount: z.string().min(1, 'Informe o valor'),
    ownerCustomer: z
      .array(
        z.object({
          customer: z.object({
            value: z.string().min(1, 'Informe um comprador'),
            label: z.string()
          }),
          percentage: z.number().min(0.01, 'Informe a porcentagem')
        })
      )
      .min(1, 'Informe pelo menos um comprador')
  })
  .superRefine((data, ctx) => {
    const total = data.ownerCustomer.reduce((sum, oc) => sum + oc.percentage, 0)

    const EPS = 0.000001

    if (total > 1 + EPS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ownerCustomer'],
        message: 'A soma das porcentagens não pode ultrapassar 100%.'
      })
    } else if (total < 1 - EPS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ownerCustomer'],
        message: 'A soma das porcentagens deve ser igual a 100%.'
      })
    }
  })

export type PurchaseHistoryForm = z.infer<typeof schemaPurchaseHistory>
