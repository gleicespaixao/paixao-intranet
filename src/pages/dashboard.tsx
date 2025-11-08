import type { NextPageWithLayout } from '@/@types/next-page-with-layout'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'
import { AppLayout } from '@/components/layout/app-layout'
import { withAuthGSSP } from '@/server/auth-ssr'

export const getServerSideProps = withAuthGSSP()

const DashboardPage: NextPageWithLayout = () => {
  return (
    <Stack gap="4">
      <Heading size="lg">Painel</Heading>
      <Box borderWidth="1px" rounded="md" p="4">
        <Text>Conteúdo do dashboard (bem simples por enquanto).</Text>
      </Box>
    </Stack>
  )
}

DashboardPage.getLayout = (page) => <AppLayout title="Dashboard">{page}</AppLayout>
export default DashboardPage
