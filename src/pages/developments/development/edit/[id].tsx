import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'
import { useRouter } from 'next/router'
import * as React from 'react'
import type { ApiDevelopment } from '@/@types/api-development'
import { getDevelopmentById } from '@/services/development'
import { LoadingOverlay } from '@/components/loading-overlay'
import { ModuleDevelopmentView } from '@/modules/developments/development/view'

export const getServerSideProps = withAuthGSSP()
const title = 'Projetos'

const ProfilePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query

  const [development, setDevelopment] = React.useState<ApiDevelopment>()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!id || typeof id !== 'string') return
    const ac = new AbortController()

    setLoading(true)
    setError(null)
    ;(async () => {
      const res = await getDevelopmentById(id, { signal: ac.signal })
      if (ac.signal.aborted) return

      if (res.success) {
        setDevelopment(res.data)
      } else {
        setError(res.error)
      }
      setLoading(false)
    })()

    return () => ac.abort()
  }, [id])

  if (loading) return <LoadingOverlay loading />

  if (error || !development) {
    console.error(error)
    return null
  }

  return <ModuleDevelopmentView initial={development} mode="edit" />
}

ProfilePage.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default ProfilePage
