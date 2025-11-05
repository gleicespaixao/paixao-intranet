'use client'

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'
import config from '@/theme'
import { Toaster } from './toaster'
import { SessionExpiryRedirect } from '../auth/session-expiry-redirect'

const system = createSystem(defaultConfig, config)

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <Toaster />
      <SessionExpiryRedirect />
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
