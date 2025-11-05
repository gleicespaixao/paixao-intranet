'use client'

import NextLink from 'next/link'
import { Box, Container, Flex, HStack, Heading, IconButton } from '@chakra-ui/react'
import { BiMenu } from 'react-icons/bi'
import { Logotipo } from '../logotipo'

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottomWidth="1px"
      bg={{ base: 'white', _dark: 'gray.950' }}
      display={{ base: 'block', md: 'none' }}
    >
      <Container maxW="full" py="2">
        <Flex align="center" minH="14" gap="4" justify="space-between">
          <HStack gap="3">
            <Heading size="md">
              <NextLink href="/dashboard">
                <Logotipo size={10} label="SisPa" />
              </NextLink>
            </Heading>
          </HStack>

          <IconButton aria-label="Abrir menu" variant="ghost" onClick={onOpenMenu}>
            <BiMenu />
          </IconButton>
        </Flex>
      </Container>
    </Box>
  )
}
