import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Header } from './header'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100dvh" bg="bg.surface">
      <Header />
      <Container as="main" maxW="8xl" py="6">
        {children}
      </Container>
    </Box>
  )
}
