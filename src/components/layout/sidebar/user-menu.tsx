import NextLink from 'next/link'
import { HStack, Text, Box, Button, Avatar, Menu } from '@chakra-ui/react'
import { BiDotsVerticalRounded, BiLogOut, BiUser } from 'react-icons/bi'
import { signOut, useSession } from 'next-auth/react'

export function UserMenu() {
  const { data: session } = useSession()

  return (
    <HStack justify="space-between" px="2.5" py="2" rounded="md" w="full" overflow="hidden">
      <HStack gap="3" w="full" overflow="hidden">
        <Avatar.Root>
          <Avatar.Fallback name={session?.user?.name ?? 'Usuário'} />
        </Avatar.Root>
        <Box>
          <Text fontSize="sm" fontWeight="medium" lineHeight="short">
            {session?.user?.name} {session?.user?.surname}
          </Text>
          <Text fontSize="xs" overflowWrap="anywhere" color="fg.muted">
            {session?.user?.email}
          </Text>
        </Box>
      </HStack>

      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="ghost" size="xs" px="2" flexShrink={0}>
            <BiDotsVerticalRounded />
          </Button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <NextLink href="/profile">
              <Menu.Item value="profile" w="full" cursor="pointer">
                <HStack w="full">
                  <BiUser />
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
                <BiLogOut />
                <Box flex="1">Sair</Box>
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </HStack>
  )
}
