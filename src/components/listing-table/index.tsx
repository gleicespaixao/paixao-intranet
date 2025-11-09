'use client'

import * as React from 'react'
import { Stack, Table, Skeleton } from '@chakra-ui/react'
import { ListingTableHeader } from './header'
import { ListingTableFooter } from './footer'

export type Option = { label: string; value: string }

export type TopSelectConfig = {
  id: string
  label: string
  options: Option[]
  value?: string
  onChange: (next: string | undefined) => void
  width?: string | number
}

export type ColumnDef<TRow extends Record<string, unknown>> = {
  id?: string
  header: React.ReactNode
  accessorKey?: StringKeyOf<TRow>
  cell?: (row: TRow) => React.ReactNode
  px?: number | string
  py?: number | string
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

export type ListingTableProps<TRow extends Record<string, unknown>> = {
  simple?: boolean
  entity: string
  rows: TRow[]
  columns: ColumnDef<TRow>[]
  topSelects?: TopSelectConfig[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  defaultPageSize?: number
  getRowId?: (row: TRow, index: number) => React.Key
  loading?: boolean
  includeHref?: string
  includeLabel?: string
}
type StringKeyOf<T> = Extract<keyof T, string>

export const ListingTable = <TRow extends Record<string, unknown>>({
  simple,
  entity,
  rows,
  columns,
  topSelects,
  searchValue,
  onSearchChange,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  defaultPageSize,
  getRowId,
  loading = false,
  includeHref,
  includeLabel
}: ListingTableProps<TRow>) => {
  function hasIdKey(obj: unknown): obj is { id: React.Key } {
    return typeof obj === 'object' && obj !== null && 'id' in obj
  }

  function isIterableReactNode(value: unknown): value is Iterable<React.ReactNode> {
    if (value == null) return false
    if (typeof value !== 'object') return false
    const maybeIterator = (value as { [Symbol.iterator]?: unknown })[Symbol.iterator]
    return typeof maybeIterator === 'function'
  }

  return (
    <Stack gap={0}>
      <ListingTableHeader
        simple={simple}
        entity={entity}
        topSelects={topSelects}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
        defaultPageSize={defaultPageSize}
        loading={loading}
        includeHref={includeHref}
        includeLabel={includeLabel}
      />
      {/* TABELA (exemplo simples; troque livremente) */}
      <Stack width="full" gap="5">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              {columns.map((col, idx) => (
                <Table.ColumnHeader
                  key={col.id ?? col.accessorKey ?? idx}
                  px={col.px ?? 6}
                  py={col.py ?? 4}
                  textAlign={col.align ?? 'left'}
                  width={col.width}
                >
                  {col.header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading
              ? Array.from({ length: Math.min(pageSize || 10, 10) }).map((_, rIdx) => (
                  <Table.Row key={`skeleton-${rIdx}`}>
                    {columns.map((col, cIdx) => (
                      <Table.Cell
                        key={`skeleton-cell-${cIdx}`}
                        px={col.px ?? 6}
                        py={col.py ?? 4}
                        textAlign={col.align ?? 'left'}
                      >
                        <Skeleton height="4" width="full" />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              : rows.map((row, rIdx) => (
                  <Table.Row key={getRowId ? getRowId(row, rIdx) : hasIdKey(row) ? row.id : rIdx}>
                    {columns.map((col, cIdx) => {
                      const key = col.id ?? col.accessorKey ?? cIdx

                      const raw = col.cell
                        ? col.cell(row)
                        : col.accessorKey
                          ? (row[col.accessorKey as StringKeyOf<TRow>] as unknown)
                          : null

                      let content: React.ReactNode
                      if (
                        raw == null ||
                        typeof raw === 'string' ||
                        typeof raw === 'number' ||
                        typeof raw === 'bigint' ||
                        typeof raw === 'boolean' ||
                        React.isValidElement(raw)
                      ) {
                        content = raw as React.ReactNode
                      } else if (isIterableReactNode(raw)) {
                        content = raw
                      } else {
                        content = String(raw)
                      }

                      return (
                        <Table.Cell key={key} px={col.px ?? 6} py={col.py ?? 4} textAlign={col.align ?? 'left'}>
                          {content}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                ))}
          </Table.Body>
        </Table.Root>

        <ListingTableFooter
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          loading={loading}
        />
      </Stack>
    </Stack>
  )
}
