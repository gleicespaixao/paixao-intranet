'use client'

import * as React from 'react'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'
import config from '@/theme'
import { Toaster } from './toaster'
import { SessionExpiryRedirect } from '../auth/session-expiry-redirect'
import { CreateEntityProvider } from '@/context/create-entity-context'

const system = createSystem(defaultConfig, config)

type AppProviderProps = ColorModeProviderProps & {
  children: React.ReactNode
  initialPermissions?: string[]
}

export function Provider({ children, initialPermissions, ...colorModeProps }: AppProviderProps) {
  return (
    <ColorModeProvider {...colorModeProps}>
      <ChakraProvider value={system}>
        <Toaster />
        <SessionExpiryRedirect />
        <CreateEntityProvider initialPermissions={initialPermissions}>{children}</CreateEntityProvider>
      </ChakraProvider>
    </ColorModeProvider>
  )
}
