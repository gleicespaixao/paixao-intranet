import { ReactNode } from 'react'
import { Box, Flex, Heading, Text, IconButton, Separator } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'
import { useRouter } from 'next/router'

type PageHeaderProps = {
  title: string
  subtitle?: string
  rightSlot?: ReactNode // ações à direita (botões, etc.)
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
  const router = useRouter()
  return (
    <Box mb={mb}>
      <Flex align="center" gap={3}>
        {backButton && (
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Voltar"
            variant="ghost"
            onClick={() => router.back()}
          >
            <BiArrowBack />
          </IconButton>
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
