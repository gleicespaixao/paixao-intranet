import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleNeighborhood } from '@/modules/developments/neighborhood'

export const getServerSideProps = withAuthGSSP()
const title = 'Bairros'

const Page: NextPageWithLayout = () => {
  return <ModuleNeighborhood title={title} />
}

Page.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default Page
