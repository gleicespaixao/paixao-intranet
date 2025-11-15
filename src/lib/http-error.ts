import axios, { AxiosError } from 'axios'

type ValidationErrorResponse = {
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
  error?: string // <- para capturar o formato { error: "mensagem" }
}

export function getApiErrorMessage(err: unknown): { message: string; status?: number } {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError
    const status = axiosErr.response?.status
    const rawData = axiosErr.response?.data as unknown

    // Se o backend respondeu só uma string
    if (typeof rawData === 'string') {
      return { message: rawData, status }
    }

    const data = rawData as ValidationErrorResponse | undefined

    // 1) Formato ASP.NET: errors: { field: [msgs] }
    if (data?.errors && Object.keys(data.errors).length > 0) {
      const messages = Object.values(data.errors).flat()
      const message = messages.join('\n')
      return { message, status }
    }

    // 2) Formato customizado: { error: "mensagem" }
    if (data?.error) {
      return { message: data.error, status }
    }

    // 3) Se tiver detail, usa
    if (data?.detail) {
      return { message: data.detail, status }
    }

    // 4) Se tiver title, usa
    if (data?.title) {
      return { message: data.title, status }
    }

    // 5) fallback: mensagem padrão do axios
    return {
      message: axiosErr.message || 'Erro de comunicação com o servidor',
      status
    }
  }

  // Não é AxiosError
  return {
    message: err instanceof Error ? err.message : 'Erro desconhecido',
    status: undefined
  }
}
