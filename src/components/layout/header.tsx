import Link from 'next/link'
import { Box, Container, Flex, Heading, Spacer, Button } from '@chakra-ui/react'
import { useSession, signOut } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()
  return (
    <Box as="header" borderBottomWidth="1px" bg="bg.canvas" py="3">
      <Container maxW="8xl">
        <Flex align="center" gap="4">
          <Heading size="md">
            <Link href="/dashboard">Paixão Intranet</Link>
          </Heading>
          <Spacer />
          <Flex align="center" gap="3">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {/* Adicione mais itens do header aqui */}
            {session ? (
              <Button colorPalette="teal" onClick={() => signOut({ redirect: true, callbackUrl: '/signin' })}>
                Sair
              </Button>
            ) : (
              <Button asChild colorPalette="teal">
                <Link href="/signin">Entrar</Link>
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
