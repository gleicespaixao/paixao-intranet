export type ServiceResult<T> = { success: true; data: T } | { success: false; error: string; status?: number }

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data }
}
export function fail<T = never>(error: string, status?: number): ServiceResult<T> {
  return { success: false, error, status }
}
