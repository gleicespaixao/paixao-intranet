import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleTypeOfProperty } from '@/modules/developments/type-of-property'

export const getServerSideProps = withAuthGSSP()
const title = 'Tipos de propriedade'

const Page: NextPageWithLayout = () => {
  return <ModuleTypeOfProperty title={title} />
}

Page.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default Page
