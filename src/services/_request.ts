import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { ok, fail, ServiceResult } from './_result'
import type { AxiosRequestConfig } from 'axios'
import { toaster } from '@/components/ui/toaster'

export async function getJson<T>(url: string, config?: AxiosRequestConfig): Promise<ServiceResult<T>> {
  try {
    const { data } = await api.get<T>(url, config)
    return ok(data)
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return fail(message, status)
  }
}

export async function addJson<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<ServiceResult<T>> {
  const toastId = toaster.create({
    title: 'Enviando dados...',
    type: 'loading',
    duration: 0
  })
  try {
    const { data } = await api.post<T>(url, body, config)
    toaster.update(toastId, {
      title: 'Registro criado com sucesso',
      type: 'success',
      duration: 3500
    })
    return ok(data)
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    toaster.update(toastId, {
      title: message ?? 'Erro ao criar registro',
      type: 'error',
      duration: 3500
    })
    return fail(message, status)
  }
}

export async function updateJson<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ServiceResult<T>> {
  const toastId = toaster.create({
    title: 'Atualizando dados...',
    type: 'loading',
    duration: 0 // fica até ser atualizado
  })
  try {
    const { data } = await api.put<T>(url, body, config)
    toaster.update(toastId, {
      title: 'Registro atualizado com sucesso',
      type: 'success',
      duration: 3500
    })
    return ok(data)
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    toaster.update(toastId, {
      title: message ?? 'Erro ao atualizar registro',
      type: 'error',
      duration: 3500
    })
    return fail(message, status)
  }
}

export async function deleteJson<T>(url: string): Promise<ServiceResult<T>> {
  const toastId = toaster.create({
    title: 'Deletando dados...',
    type: 'loading',
    duration: 0 // fica até ser atualizado
  })
  try {
    const { data } = await api.delete<T>(url)
    toaster.update(toastId, {
      title: 'Registro deletado com sucesso',
      type: 'success',
      duration: 3500
    })
    return ok(data)
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    toaster.update(toastId, {
      title: message ?? 'Erro ao deletar registro',
      type: 'error',
      duration: 3500
    })
    return fail(message, status)
  }
}
