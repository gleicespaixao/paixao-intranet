import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'

export type Result<T> = { success: true; data: T } | { success: false; error: string; status?: number }

export async function fetchUserPermissions(): Promise<Result<string[]>> {
  try {
    const { data } = await api.get<string[]>('/Tools/user/permissions')
    // garante únicos e strings válidas
    const unique = Array.from(new Set((data ?? []).filter((x): x is string => typeof x === 'string')))
    return { success: true, data: unique }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}
