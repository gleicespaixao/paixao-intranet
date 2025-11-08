'use client'

import { Stack, Text, Pagination, IconButton, ButtonGroup, Box } from '@chakra-ui/react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

export type ListingTableHeaderProps = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export const ListingTableFooter = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  loading = false
}: ListingTableHeaderProps) => {
  const pageStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const pageEnd = Math.min(page * pageSize, totalCount)
  return (
    <>
      <Stack
        w="full"
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'center', md: 'space-between' }}
        align="center"
        gap={{ base: 4, md: 0 }}
        px={6}
        pb={4}
      >
        <Text fontSize="sm" color="fg.subtle" textAlign={{ base: 'center', md: 'left' }}>
          Exibindo de {pageStart} a {pageEnd} de {totalCount} entradas
        </Text>

        <Box w={{ base: 'full', md: 'auto' }} display="flex" justifyContent={{ base: 'center', md: 'flex-end' }}>
          <Pagination.Root
            count={totalCount}
            pageSize={pageSize}
            page={page}
            onPageChange={(d) => onPageChange(d.page)}
          >
            <ButtonGroup variant="outline" size="sm" wrap="wrap">
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Página anterior" disabled={loading}>
                  <BiChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(p) => (
                  <IconButton key={p.value} variant={{ base: 'outline', _selected: 'solid' }} disabled={loading}>
                    {p.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Próxima página" disabled={loading}>
                  <BiChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Box>
      </Stack>
    </>
  )
}
