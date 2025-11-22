import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleRealEstateDeveloper } from '@/modules/developments/real-estate-developer'

export const getServerSideProps = withAuthGSSP()
const title = 'Incorporadoras'

const Page: NextPageWithLayout = () => {
  return <ModuleRealEstateDeveloper title={title} />
}

Page.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default Page
