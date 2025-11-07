import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'

export type RequestPasswordResetPayload = { identifier: string }
export type RequestPasswordResetResponse = { email: string }

export type Ok<T> = { success: true; data: T }
export type Fail = { success: false; error: string; status?: number }
export type Result<T> = Ok<T> | Fail

/** Solicita o envio de e-mail para redefinição de senha */
export async function requestPasswordReset(
  payload: RequestPasswordResetPayload
): Promise<Result<RequestPasswordResetResponse>> {
  try {
    const { data } = await api.post<RequestPasswordResetResponse>('/Authentication/request-password-reset', payload)
    return { success: true, data }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}

export type ApiAuthResponse = {
  token: string
  expiration: string
  adminAccess: boolean
  user: { email: string; name?: string; surname?: string; id: string }
}

export type ResetPasswordPayload = { password: string; token: string }

/** Confirma a redefinição de senha */
export async function resetPassword(payload: ResetPasswordPayload): Promise<Result<ApiAuthResponse>> {
  try {
    const { data } = await api.post<ApiAuthResponse>('/Authentication/reset-password', payload)
    return { success: true, data }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}

export type LoginPayload = {
  identifier: string
  password: string
}

/** Login */
export async function loginWithCredentials(payload: LoginPayload): Promise<Result<ApiAuthResponse>> {
  try {
    const { data } = await api.post<ApiAuthResponse>('/Authentication/login', payload)

    if (!data?.token) {
      return { success: false, error: 'Resposta inválida da API.' }
    }
    return { success: true, data }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}

export type UpdatePasswordPayload = {
  oldPassword: string
  newPassword: string
}

/** Primeiro acesso / troca de senha provisória */
export async function updatePassword(payload: UpdatePasswordPayload): Promise<Result<null>> {
  try {
    await api.patch('/Authentication/update-password', payload)
    return { success: true, data: null }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}
