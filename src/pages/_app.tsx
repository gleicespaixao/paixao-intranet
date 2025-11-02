import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { SessionProvider } from 'next-auth/react'
import { NextPageWithLayout } from '@/types/next-page-with-layout'

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout }

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <SessionProvider>
      <Provider>{getLayout(<Component {...pageProps} />)}</Provider>
    </SessionProvider>
  )
}
