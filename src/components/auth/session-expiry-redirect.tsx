'use client'

import * as React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { toaster } from '@/components/ui/toaster'

const COUNTDOWN_START_SEC = 10

export function SessionExpiryRedirect() {
  const { data: session } = useSession()
  const router = useRouter()
  const toastIdRef = React.useRef<string | null>(null)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (!session?.expiresAt) {
      if (toastIdRef.current) {
        toaster.dismiss(toastIdRef.current)
        toastIdRef.current = null
      }
      return
    }

    const expiry = Date.parse(session.expiresAt)

    const tick = () => {
      const msLeft = expiry - Date.now()
      const secLeft = Math.ceil(msLeft / 1000)

      // sessão já expirou → sai agora
      if (secLeft <= 0) {
        if (toastIdRef.current) {
          toaster.update(toastIdRef.current, {
            id: toastIdRef.current,
            title: 'Sessão expirada',
            description: 'Redirecionando para login…',
            type: 'loading',
            closable: false
          })
        } else {
          toastIdRef.current = toaster.create({
            title: 'Sessão expirada',
            description: 'Redirecionando para login…',
            type: 'loading',
            closable: false
          })
        }
        // um pequeno delay só para o usuário ver a mensagem
        setTimeout(() => {
          void signOut({ callbackUrl: `/sign-in?callbackUrl=${encodeURIComponent(router.asPath)}` })
        }, 600)
        // para o intervalo
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = null
        return
      }

      // quando faltar <= COUNTDOWN_START_SEC, mostramos/atualizamos o toast
      if (secLeft <= COUNTDOWN_START_SEC) {
        const desc = `Sua sessão expira em ${secLeft}s`
        if (!toastIdRef.current) {
          toastIdRef.current = toaster.create({
            description: desc,
            type: 'info',
            closable: false
          })
        } else {
          toaster.update(toastIdRef.current, {
            id: toastIdRef.current,
            description: desc
          })
        }
      } else {
        // mais de 10s restantes → garante que não há toast aberto
        if (toastIdRef.current) {
          toaster.dismiss(toastIdRef.current)
          toastIdRef.current = null
        }
      }
    }

    // primeiro tick imediato e depois a cada 1s
    tick()
    intervalRef.current = setInterval(tick, 1000)

    // se o usuário voltar a aba depois de muito tempo, recalcula na hora
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [session?.expiresAt, router.asPath])

  return null
}
