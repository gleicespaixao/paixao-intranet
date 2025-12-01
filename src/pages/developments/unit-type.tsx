import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleUnitType } from '@/modules/developments/unit-type'

export const getServerSideProps = withAuthGSSP()
const title = 'Tipos de unidade'

const Page: NextPageWithLayout = () => {
  return <ModuleUnitType title={title} />
}

Page.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default Page
