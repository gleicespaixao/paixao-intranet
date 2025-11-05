'use client'

import { CloseButton, Drawer, Portal } from '@chakra-ui/react'
import { SidebarContent } from './content'

export function SidebarDrawer({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Portal>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
          <Drawer.Body p={0}>
            <SidebarContent withinDrawer onNavigate={onNavigate} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  )
}
