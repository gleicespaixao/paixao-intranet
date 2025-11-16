'use client'

import NextLink from 'next/link'
import React from 'react'
import { Box, VStack, Text, Icon, Separator, Accordion, Heading, Stack } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import { Logotipo } from '../../logotipo'
import { ItemRoot } from './item-root'
import { UserMenu } from './user-menu'
import { sidebarData } from './data'
import { ColorModeMenuButton } from './color-mode-menu'

export function SidebarContent({
  withinDrawer = false,
  onNavigate
}: {
  withinDrawer?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const isActive = (href?: string) => !!href && pathname?.startsWith(href)

  const derivedOpen = React.useMemo(
    () =>
      sidebarData.filter((i) => i.children && i.children.some((c) => pathname?.startsWith(c.href))).map((i) => i.label),
    [pathname]
  )
  const [open, setOpen] = React.useState<string[]>(derivedOpen)
  React.useEffect(() => {
    setOpen(derivedOpen)
  }, [derivedOpen])

  return (
    <Box
      gap="3"
      px={{ base: '2.5', md: '3' }}
      py={{ base: '2.5', md: '4' }}
      h="full"
      display="flex"
      flexDirection="column"
      bg={{ base: 'white', _dark: 'gray.950' }}
    >
      <Heading size="md" px="2" py="1.5" mb="2">
        <NextLink href="/dashboard">
          <Logotipo size={10} label="SisPa" />
        </NextLink>
      </Heading>

      <VStack align="stretch" flex="1">
        {sidebarData
          .filter((i) => !i.children)
          .map((item) => (
            <ItemRoot
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
              onClick={withinDrawer ? onNavigate : undefined}
            />
          ))}

        <Accordion.Root
          variant="plain"
          value={open}
          onValueChange={(details) => setOpen(details.value)}
          multiple={false}
          collapsible
        >
          <Stack>
            {sidebarData
              .filter((i) => i.children)
              .map((item) => (
                <Accordion.Item key={item.label} value={item.label}>
                  <Accordion.ItemTrigger
                    px="3.5"
                    py="2.5"
                    cursor="pointer"
                    _hover={{ bg: { base: 'gray.100', _dark: 'gray.800' } }}
                    _expanded={{ bg: { base: 'gray.100', _dark: 'gray.800' } }}
                  >
                    {item.icon && <Icon as={item.icon} boxSize="4.5" color={{ base: 'gray.500', _dark: 'gray.400' }} />}
                    <Text fontSize="sm">{item.label}</Text>
                    <Accordion.ItemIndicator marginStart="auto" />
                  </Accordion.ItemTrigger>

                  <Accordion.ItemContent>
                    <VStack align="stretch" mt="1" gap="1">
                      {item.children!.map((c) => (
                        <ItemRoot
                          key={c.href}
                          label={c.label}
                          href={c.href}
                          isActive={isActive(c.href)}
                          isSubmenu
                          onClick={withinDrawer ? onNavigate : undefined}
                        />
                      ))}
                    </VStack>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
          </Stack>
        </Accordion.Root>
      </VStack>

      <VStack align="stretch" gap="2">
        <Separator />
        <ColorModeMenuButton />
        {/* <Separator />
        <ItemRoot
          label="Configurações"
          href="/"
          icon={BiCog}
          isActive={isActive('/settings')}
          onClick={withinDrawer ? onNavigate : undefined}
        /> */}
        <Separator />
        <UserMenu onClick={withinDrawer ? onNavigate : undefined} />
      </VStack>
    </Box>
  )
}
