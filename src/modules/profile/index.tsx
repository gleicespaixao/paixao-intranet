import { Separator } from '@chakra-ui/react'

import { ModuleProfilePassword } from './password'
import { ModuleProfileInformation } from './information'
import { PageHeader } from '@/components/layout/page-header'

export const ModuleProfile = ({ title }: { title: string }) => {
  return (
    <>
      <PageHeader title={title} subtitle="Atualize suas informações" backButton />

      <ModuleProfileInformation />
      <Separator mb="10" />
      <ModuleProfilePassword />
    </>
  )
}
