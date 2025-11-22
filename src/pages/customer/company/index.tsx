import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleCompany } from '@/modules/customer/company'

export const getServerSideProps = withAuthGSSP()
const title = 'Empresas'

const ProfilePage: NextPageWithLayout = () => {
  return <ModuleCompany title={title} />
}

ProfilePage.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default ProfilePage
