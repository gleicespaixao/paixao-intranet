'use client'

import NextLink from 'next/link'
import { Box, Container, Flex, HStack, Heading, Menu, Avatar, Portal } from '@chakra-ui/react'
import { FiUser, FiLogOut } from 'react-icons/fi'
import { useSession, signOut } from 'next-auth/react'
import { ColorModeButton } from '../ui/color-mode'
import { Logotipo } from '../logotipo'

export function Header() {
  const { data: session } = useSession()

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottomWidth="1px"
      bg={{ base: 'white', _dark: 'gray.950' }}
    >
      <Container maxW="8xl" py="2">
        <Flex align="center" minH="14" gap="4" justify="space-between">
          <HStack gap="3">
            <Heading size="md">
              <NextLink href="/dashboard">
                <Logotipo size={10} label="SisPa" />
              </NextLink>
            </Heading>
          </HStack>

          <HStack gap="6">
            <ColorModeButton variant="ghost" rounded="full" />
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger rounded="full" focusRing="outside" cursor="pointer">
                <Avatar.Root>
                  <Avatar.Fallback name={session?.user?.name} />
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <NextLink href="/profile">
                      <Menu.Item value="profile" w="full" cursor="pointer">
                        <HStack w="full">
                          <FiUser />
                          <Box flex="1">Perfil</Box>
                        </HStack>
                      </Menu.Item>
                    </NextLink>
                    <Menu.Separator />
                    <Menu.Item
                      value="exit"
                      cursor="pointer"
                      onClick={() => signOut({ redirect: true, callbackUrl: '/sign-in' })}
                    >
                      <HStack w="full">
                        <FiLogOut />
                        <Box flex="1">Sair</Box>
                      </HStack>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
