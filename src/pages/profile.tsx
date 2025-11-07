import { withAuthGSSP } from '@/server/auth-ssr'
import type { NextPageWithLayout } from '@/types/next-page-with-layout'
import { AppLayout } from '@/components/layout/app-layout'

import { ModuleProfile } from '@/modules/profile'

export const getServerSideProps = withAuthGSSP()
const title = 'Perfil'

const ProfilePage: NextPageWithLayout = () => {
  return <ModuleProfile title={title} />
}

ProfilePage.getLayout = (page) => <AppLayout title={title}>{page}</AppLayout>
export default ProfilePage
