'use client'

import { ReactNode } from 'react'
import { Box, Container, Drawer, Grid } from '@chakra-ui/react'
import { Seo } from '@/components/seo'
import { AdminAccessBanner } from '../admin-access-banner'
import { FirstAccessModal } from '../first-access-modal'
import { Header } from './header'
import { SidebarDrawer } from './sidebar'
import { SidebarContent } from './sidebar/content'
import React from 'react'

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const handleNavigate = () => setIsDrawerOpen(false)
  return (
    <Box minH="100dvh" bg="bg.surface">
      <Seo title={title} />
      <AdminAccessBanner />
      <FirstAccessModal />

      <Drawer.Root open={isDrawerOpen} onOpenChange={(d) => setIsDrawerOpen(d.open)} placement="start">
        <Header onOpenMenu={() => setIsDrawerOpen(true)} />
        <Box display={{ base: 'block', md: 'none' }}>
          <SidebarDrawer onNavigate={handleNavigate} />
        </Box>
      </Drawer.Root>

      <Grid templateColumns={{ base: '1fr', md: '20rem 1fr' }} maxW="full">
        <Box
          as="aside"
          display={{ base: 'none', md: 'block' }}
          position="sticky"
          top="0"
          alignSelf="start"
          h="100dvh"
          overflowY="auto"
          borderRightWidth="1px"
          bg="bg.surface"
        >
          <SidebarContent />
        </Box>

        <Container as="main" maxW="full" py="6">
          {children}
        </Container>
      </Grid>
    </Box>
  )
}
