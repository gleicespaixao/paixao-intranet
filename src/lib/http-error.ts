import type { AxiosError } from 'axios'

type ApiErrorPayload = { error?: string; message?: string; url?: string }

export function getApiErrorMessage(err: unknown): string | null {
  const e = err as Partial<AxiosError<ApiErrorPayload>>
  const data = e?.response?.data
  if (data?.error) return data.error
  if (data?.message) return data.message
  return null
}
