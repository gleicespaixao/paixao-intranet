import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Header } from './header'
import { Seo } from '@/components/seo'

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <Box minH="100dvh" bg="bg.surface">
      <Seo title={title} />
      <Header />
      <Container as="main" maxW="8xl" py="6">
        {children}
      </Container>
    </Box>
  )
}
