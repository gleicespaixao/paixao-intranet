import NextLink from 'next/link'
import { HStack, Text, Icon, Box, Button, Link as ChakraLink } from '@chakra-ui/react'
import { IconType } from 'react-icons/lib'

type ItemRootProps = {
  label: string
  href?: string
  icon?: IconType
  isActive?: boolean
  isSubmenu?: boolean
  onNavigate?: () => void
}

export function ItemRoot({ label, href, icon, isActive, isSubmenu, onNavigate }: ItemRootProps) {
  const content = (
    <HStack
      px="3.5"
      py="2.5"
      rounded="md"
      gap="3"
      pl={isSubmenu ? 11 : undefined}
      _hover={{ bg: { base: 'gray.100', _dark: 'gray.800' }, textDecoration: 'none' }}
      bg={isActive ? { base: 'blue.50', _dark: 'gray.800' } : 'transparent'}
      color={isActive ? { base: 'blue.600', _dark: 'blue.200' } : undefined}
    >
      {icon && (
        <Icon as={icon} boxSize="4.5" color={isActive ? 'currentColor' : { base: 'gray.500', _dark: 'gray.400' }} />
      )}
      <Text fontWeight={isSubmenu ? 'normal' : 'medium'} fontSize="sm">
        {label}
      </Text>
    </HStack>
  )

  if (href) {
    return (
      <ChakraLink
        color="fg"
        as={NextLink}
        href={href}
        onClick={onNavigate}
        _hover={{ textDecoration: 'none' }}
        display="block"
      >
        {content}
      </ChakraLink>
    )
  }

  return (
    <Box as={Button} onClick={onNavigate} w="full" textAlign="left">
      {content}
    </Box>
  )
}
