import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'
import { ModuleDevelopmentView } from '@/modules/developments/development/view'

export const getServerSideProps = withAuthGSSP()

const Page: NextPageWithLayout = () => {
  return <ModuleDevelopmentView mode={'create'} />
}

Page.getLayout = (page) => <AppLayout title="Novo projeto">{page}</AppLayout>
export default Page
