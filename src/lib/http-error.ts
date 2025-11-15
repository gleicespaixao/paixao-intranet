import axios, { AxiosError } from 'axios'

type ValidationErrorResponse = {
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(err: unknown): { message: string; status?: number } {
  // Se for erro do Axios
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError
    const status = axiosErr.response?.status
    const data = axiosErr.response?.data as ValidationErrorResponse | undefined

    // 1) Se veio objeto de validação no padrão do ASP.NET (errors: { field: [msgs] })
    if (data?.errors && Object.keys(data.errors).length > 0) {
      // junta todas as mensagens em uma string só
      const messages = Object.values(data.errors).flat()
      const message = messages.join('\n') // ou ' | ' se preferir
      return { message, status }
    }

    // 2) Se tiver detail, usa
    if (data?.detail) {
      return { message: data.detail, status }
    }

    // 3) Se tiver title, usa
    if (data?.title) {
      return { message: data.title, status }
    }

    // 4) fallback: mensagem padrão do axios
    return { message: axiosErr.message || 'Erro de comunicação com o servidor', status }
  }

  // Não é AxiosError
  return {
    message: err instanceof Error ? err.message : 'Erro desconhecido',
    status: undefined
  }
}
