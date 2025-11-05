import { AxiosError } from 'axios'

type ApiErrorPayload = { error?: string; message?: string; detail?: string; url?: string }

export function getApiErrorMessage(err: unknown): { message: string; status?: number } {
  const ax = err as AxiosError<ApiErrorPayload>
  const status = ax.response?.status
  const data = ax.response?.data

  let message: string | undefined

  if (typeof data === 'string') {
    message = data
  } else if (data) {
    message = data.error || data.message || data.detail
  }

  if (!message) {
    message = ax.message || 'Erro inesperado.'
  }

  return { message, status }
}
