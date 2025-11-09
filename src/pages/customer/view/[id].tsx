import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'
import { ModuleCustomerView } from '@/modules/customer/view'
import { useRouter } from 'next/router'
import * as React from 'react'
import type { ApiCustomer } from '@/@types/api-customer'
import { getCustomerById } from '@/services/customer'

export const getServerSideProps = withAuthGSSP()
const title = 'Clientes'

const ProfilePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query

  const [customer, setCustomer] = React.useState<ApiCustomer | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!id || typeof id !== 'string') return
    const ac = new AbortController()

    setLoading(true)
    setError(null)
    ;(async () => {
      const res = await getCustomerById(id, { signal: ac.signal })
      if (ac.signal.aborted) return

      if (res.success) {
        setCustomer(res.data)
      } else {
        setError(res.error)
      }
      setLoading(false)
    })()

    return () => ac.abort()
  }, [id])

  if (error) {
    console.error(error)
    return null
  }

  return <ModuleCustomerView customer={customer ?? undefined} loading={loading} />
}

ProfilePage.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default ProfilePage
