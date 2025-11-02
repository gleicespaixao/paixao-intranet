import { useColorMode } from '@/components/ui/color-mode'
import { Box, Button, Heading, Stack } from '@chakra-ui/react'

export default function Home() {
  const { toggleColorMode } = useColorMode()

  return (
    <Box p={8}>
      <Stack gap={4}>
        <Heading>Next + Chakra UI v3</Heading>
        <Button onClick={toggleColorMode}>Alternar tema</Button>
      </Stack>
    </Box>
  )
}
