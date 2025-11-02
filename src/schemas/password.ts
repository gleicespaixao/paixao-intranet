import { z } from 'zod'

export const schemaRequestReset = z.object({
  identifier: z.string().min(1, 'Informe usuário ou e-mail').trim()
})
export type RequestResetForm = z.infer<typeof schemaRequestReset>

export const schemaResetPassword = z
  .object({
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo de 6 caracteres'),
    token: z.string().min(1, 'Token obrigatório')
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })
export type ResetPasswordForm = z.infer<typeof schemaResetPassword>

export const schemaUpdatePassword = z
  .object({
    oldPassword: z.string().min(1, 'Informe a senha provisória'),
    newPassword: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo de 6 caracteres')
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

export type UpdatePasswordForm = z.infer<typeof schemaUpdatePassword>
