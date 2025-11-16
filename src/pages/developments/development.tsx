import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleDevelopment } from '@/modules/developments/development'

export const getServerSideProps = withAuthGSSP()
const title = 'Projetos'

const Page: NextPageWithLayout = () => {
  return <ModuleDevelopment title={title} />
}

Page.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default Page
