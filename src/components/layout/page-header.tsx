import { ReactNode } from 'react'
import { Box, Flex, Heading, Text, IconButton, Separator, Skeleton, Stack } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'
import NextLink from 'next/link'

type PageHeaderProps = {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  backButton?: boolean
  backButtonLink?: string
  withSeparator?: boolean
  mb?: number | string
  loading?: boolean
}

export function PageHeader({
  title,
  subtitle,
  rightSlot,
  backButton = false,
  backButtonLink,
  withSeparator = true,
  mb = 6,
  loading = false
}: PageHeaderProps) {
  return (
    <Box mb={mb}>
      <Flex align="center" gap={3}>
        {backButton && (
          <Stack display={{ base: 'flex', md: 'none' }}>
            <NextLink href={backButtonLink ?? '/dashboard'}>
              <IconButton aria-label="Voltar" variant="ghost">
                <BiArrowBack />
              </IconButton>
            </NextLink>
          </Stack>
        )}

        <Stack>
          <Heading size="lg">
            <Skeleton height="6" loading={loading}>
              {title}
            </Skeleton>
          </Heading>
          {subtitle && (
            <Skeleton height="4" loading={loading}>
              <Text fontSize="sm" color="fg.muted">
                {subtitle}
              </Text>
            </Skeleton>
          )}
        </Stack>

        {rightSlot && <Flex ml="auto">{rightSlot}</Flex>}
      </Flex>

      {withSeparator && <Separator mt={4} />}
    </Box>
  )
}
