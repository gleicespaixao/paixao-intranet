import { useSession } from 'next-auth/react'
import { Alert, Box, Container, Text } from '@chakra-ui/react'

/**
 * Mostra aviso quando adminAccess === true
 * Fica fixo no topo e não aparece em páginas públicas.
 */
export function AdminAccessBanner() {
  const { data: session } = useSession()
  const isAdminAccess = session?.adminAccess === true
  if (!isAdminAccess) return null

  const target = session?.user?.name ?? session?.user?.email ?? 'usuário'

  return (
    <Box position="sticky" top="0" zIndex="banner" bg="bg.canvas">
      <Container maxW="6xl" px="4" py="2">
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Text fontWeight="medium">
            ATENÇÃO: Você está acessando a conta de <b>{target}</b> com senha mestra. Aja com cautela — todas as ações
            são registradas em log.
          </Text>
        </Alert.Root>
      </Container>
    </Box>
  )
}
