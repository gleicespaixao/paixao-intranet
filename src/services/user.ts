import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { ApiUser } from '@/types/next-auth'
import { dateConverter } from '@/utils/date-converter'

export type Result<T> = { success: true; data: T } | { success: false; error: string; status?: number }

export type UpdateUserSimplePayload = {
  name: string
  surname: string
  dateBirth: Date | string
  email: string
  phone: string
}

export async function updateUserSimple(payload: UpdateUserSimplePayload): Promise<Result<ApiUser>> {
  try {
    // 1) Converter para 'dd/MM/yyyy' (pt-BR) só se for Date
    const dateBr =
      payload.dateBirth instanceof Date
        ? payload.dateBirth.toLocaleDateString('pt-BR') // ex.: 31/12/2000
        : payload.dateBirth // já é string; assumimos que vem em 'dd/MM/yyyy' ou formato aceito pelo seu conversor

    // 2) Converter para o formato internacional que a API espera (ex.: yyyy-MM-dd)
    const dateInternational = dateConverter(dateBr, 'international')

    if (!dateInternational) {
      return { success: false, error: 'Data de nascimento inválida' }
    }
    console.log(dateInternational)
    // 3) Montar o payload final (sem mutar o original)
    const body = {
      ...payload,
      dateBirth: dateInternational
    }

    const { data } = await api.put<ApiUser>('/Tools/user', body)

    return { success: true, data }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}
