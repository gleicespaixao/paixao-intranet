'use client'

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'
import config from '@/theme'

const system = createSystem(defaultConfig, config)

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
