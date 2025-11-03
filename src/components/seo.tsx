import Head from 'next/head'
import { useRouter } from 'next/router'

type SeoProps = {
  title?: string
  description?: string
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
}

const SITE_NAME = 'SisPa'
const DEFAULT_DESC = 'Plataforma para regenciamento de imóveis (SisPa)'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function Seo({ title, description = DEFAULT_DESC, noIndex, noFollow, canonical }: SeoProps) {
  const { asPath } = useRouter()
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const robots = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`
  const url = canonical ?? `${BASE_URL}${asPath}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* Open Graph / Twitter */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Head>
  )
}
