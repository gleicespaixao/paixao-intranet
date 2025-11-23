import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'
import { ModuleNewEditDevelopment } from '@/modules/developments/development/new'

export const getServerSideProps = withAuthGSSP()

const Page: NextPageWithLayout = () => {
  return <ModuleNewEditDevelopment mode={'create'} />
}

Page.getLayout = (page) => <AppLayout title="Novo projeto">{page}</AppLayout>
export default Page
