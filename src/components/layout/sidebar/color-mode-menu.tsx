'use client'

import { ClientOnly, Button, HStack, Text, IconButtonProps, Menu, Icon } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { useColorMode } from '@/components/ui/color-mode'
import { BiCheck, BiDesktop, BiMoon, BiSun } from 'react-icons/bi'

type Props = Omit<IconButtonProps, 'aria-label' | 'children'>

export function ColorModeMenuButton(props: Props) {
  const { setColorMode } = useColorMode()
  const { theme, resolvedTheme } = useTheme() // theme = preferência ('light'|'dark'|'system')
  // resolvedTheme = 'light'|'dark'

  const isActive = (value: 'light' | 'dark' | 'system') =>
    (value === 'system' && theme === 'system') || (value !== 'system' && theme === value)

  const IconCmp = theme === 'system' ? BiDesktop : resolvedTheme === 'dark' ? BiMoon : BiSun

  return (
    <ClientOnly>
      <Menu.Root positioning={{ placement: 'bottom-end' }}>
        <Menu.Trigger asChild>
          <Button
            px={3}
            color="fg"
            gap="3.5"
            justifyContent="flex-start"
            _hover={{ bg: { base: 'gray.100', _dark: 'gray.800' }, textDecoration: 'none' }}
            variant="ghost"
            aria-label="Mudar tema"
            {...props}
          >
            <Icon as={IconCmp} boxSize="4.5" color="fg.muted" />
            Mudar tema
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content minW="44">
            <Menu.Item value="light" onClick={() => setColorMode('light')}>
              <HStack w="full">
                <BiSun />
                <Text flex="1">Light</Text>
                {isActive('light') && <BiCheck />}
              </HStack>
            </Menu.Item>

            <Menu.Item value="dark" onClick={() => setColorMode('dark')}>
              <HStack w="full">
                <BiMoon />
                <Text flex="1">Dark</Text>
                {isActive('dark') && <BiCheck />}
              </HStack>
            </Menu.Item>

            <Menu.Item value="system" onClick={() => setColorMode('system')}>
              <HStack w="full">
                <BiDesktop />
                <Text flex="1">System</Text>
                {isActive('system') && <BiCheck />}
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </ClientOnly>
  )
}
