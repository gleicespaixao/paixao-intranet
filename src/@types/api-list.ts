// src/types/api.ts
export type ApiListResponse<T> = {
  totalRecords: number
  totalPages: number
  records: T[]
}

export type Ok<T> = { success: true; data: T }
export type Fail = { success: false; error: string; status?: number }
export type Result<T> = Ok<T> | Fail
