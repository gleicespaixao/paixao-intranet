import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleLeisure } from '@/modules/developments/leisure'

export const getServerSideProps = withAuthGSSP()
const title = 'Lazeres'

const Page: NextPageWithLayout = () => {
  return <ModuleLeisure title={title} />
}

Page.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default Page
