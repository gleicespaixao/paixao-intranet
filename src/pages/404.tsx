import NextLink from 'next/link'
import { Box, Container, Heading, Text, Button, Stack, Center } from '@chakra-ui/react'
import { BiHome } from 'react-icons/bi'
import { Seo } from '@/components/seo'

export default function Custom404Page() {
  return (
    <>
      <Seo title="Página não encontrada" noIndex />
      <Box minH="100dvh" display="grid" placeItems="center">
        <Container maxW="lg" py={{ base: 16, md: 24 }}>
          <Center>
            <Stack gap={6} textAlign="center">
              <Heading size="2xl">404</Heading>
              <Heading size="lg" color="fg.muted">
                Página não encontrada
              </Heading>
              <Text color="fg.muted">A URL acessada não existe. Verifique o endereço ou volte para o início.</Text>
              <Button asChild>
                <NextLink href="/dashboard">
                  <BiHome /> Ir para o início
                </NextLink>
              </Button>
            </Stack>
          </Center>
        </Container>
      </Box>
    </>
  )
}
