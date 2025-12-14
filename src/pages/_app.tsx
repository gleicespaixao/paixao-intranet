import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { SessionProvider, useSession } from 'next-auth/react'
import { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { setApiAccessToken } from '@/lib/token-store'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import ProgressBar from '@badrap/bar-of-progress'

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout }

function SyncApiToken() {
  const { data } = useSession()
  const token = data?.accessToken ?? null

  useEffect(() => {
    setApiAccessToken(token)
  }, [token])

  return null
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const progress = useMemo(
    () =>
      new ProgressBar({
        size: 2,
        className: 'badrap-progress-bar',
        delay: 100,
        color: 'var(--chakra-colors-teal-500)'
      }),
    []
  )
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', progress.start)
    router.events.on('routeChangeComplete', progress.finish)
    router.events.on('routeChangeError', progress.finish)
  }, [progress.finish, progress.start, router])
  return (
    <SessionProvider session={pageProps?.session}>
      <SyncApiToken />
      <Provider>{getLayout(<Component {...pageProps} />)}</Provider>
    </SessionProvider>
  )
}
