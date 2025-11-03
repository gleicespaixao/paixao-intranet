import { defineConfig } from '@chakra-ui/react'

export default defineConfig({
  globalCss: {
    ':root': { colorPalette: 'teal' },
    'html, body': {
      height: '100%',
      bg: { base: 'gray.50', _dark: 'gray.900' }, // fundo claro / escuro
      color: { base: 'gray.900', _dark: 'gray.50' } // cor do texto
    },
    '#__next': { minHeight: '100%' }
  },
  theme: {
    tokens: {}
  }
})
