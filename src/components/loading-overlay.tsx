// components/LoadingOverlay.tsx
import { Box, Spinner, Text } from '@chakra-ui/react'
import React from 'react'

type LoadingOverlayProps = { loading: boolean; blur?: number; message?: string }

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  blur = 10,
  message = 'Buscando informações'
}) => {
  if (!loading) return null
  return (
    <Box
      position="absolute"
      inset={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      backdropFilter={`blur(${blur}px)`}
      bg="blackAlpha.300"
      zIndex={1}
      borderRadius="inherit" // pega o raio do pai
      pointerEvents="all"
      cursor="wait"
      role="status"
      aria-busy="true"
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Spinner animationDuration="0.6s" />
        {message && <Text fontSize="sm">{message}</Text>}
      </Box>
    </Box>
  )
}
