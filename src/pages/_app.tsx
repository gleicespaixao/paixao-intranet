import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { SessionProvider, useSession } from 'next-auth/react'
import { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { setApiAccessToken } from '@/lib/token-store'
import { useEffect } from 'react'

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
  return (
    <SessionProvider session={pageProps?.session}>
      <SyncApiToken />
      <Provider>{getLayout(<Component {...pageProps} />)}</Provider>
    </SessionProvider>
  )
}
