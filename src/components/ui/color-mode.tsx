'use client'

import type { IconButtonProps, SpanProps } from '@chakra-ui/react'
import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react'
import type { ThemeProviderProps } from 'next-themes'
import { ThemeProvider, useTheme } from 'next-themes'
import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export type ColorModeProviderProps = ThemeProviderProps

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system" // ✅ segue o sistema por padrão
      enableSystem // ✅ habilita prefers-color-scheme
      disableTransitionOnChange
      {...props}
    />
  )
}

export type ColorMode = 'light' | 'dark' | 'system'

export interface UseColorModeReturn {
  /** resolvedTheme retorna 'light' | 'dark' (não 'system') */
  colorMode: Exclude<ColorMode, 'system'>
  /** aceita inclusive 'system' para persistir a preferência */
  setColorMode: (colorMode: ColorMode) => void
  /** alterna apenas entre light/dark */
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return {
    colorMode: resolvedTheme as 'light' | 'dark',
    setColorMode: setTheme, // pode receber 'light' | 'dark' | 'system'
    toggleColorMode
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

type ColorModeButtonProps = Omit<IconButtonProps, 'aria-label'>

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize="8" />}>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Alternar tema"
          size="sm"
          ref={ref}
          {...props}
          css={{
            _icon: { width: '5', height: '5' }
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    )
  }
)

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(function LightMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      colorScheme="light"
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(function DarkMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  )
})
