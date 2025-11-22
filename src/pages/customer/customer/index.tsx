import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleCustomer } from '@/modules/customer/customer'

export const getServerSideProps = withAuthGSSP()
const title = 'Pessoas'

const ProfilePage: NextPageWithLayout = () => {
  return <ModuleCustomer title={title} />
}

ProfilePage.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default ProfilePage
