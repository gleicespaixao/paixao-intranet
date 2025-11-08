import { ReactNode } from 'react'
import { Box, Flex, Heading, Text, IconButton, Separator } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'
import NextLink from 'next/link'

type PageHeaderProps = {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  backButton?: boolean
  withSeparator?: boolean
  mb?: number | string
}

export function PageHeader({
  title,
  subtitle,
  rightSlot,
  backButton = false,
  withSeparator = true,
  mb = 6
}: PageHeaderProps) {
  return (
    <Box mb={mb}>
      <Flex align="center" gap={3}>
        {backButton && (
          <NextLink href="/dashboard">
            <IconButton display={{ base: 'flex', md: 'none' }} aria-label="Voltar" variant="ghost">
              <BiArrowBack />
            </IconButton>
          </NextLink>
        )}

        <Box>
          <Heading size="lg">{title}</Heading>
          {subtitle && (
            <Text fontSize="sm" color="fg.muted">
              {subtitle}
            </Text>
          )}
        </Box>

        {rightSlot && <Flex ml="auto">{rightSlot}</Flex>}
      </Flex>

      {withSeparator && <Separator mt={4} />}
    </Box>
  )
}
