'use client'

import {
  Button,
  createListCollection,
  type ListCollection,
  For,
  Heading,
  HStack,
  Input,
  Portal,
  Select,
  Separator,
  Stack,
  IconButton
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { TopSelectConfig, Option } from '.'
import { sentenceCase } from '@/utils/sentence-case'

export type ListingTableHeaderProps = {
  simple?: boolean
  entity: string
  topSelects?: TopSelectConfig[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  defaultPageSize?: number
  loading?: boolean
  includeHref?: string
  includeLabel?: string
  includeOnClick?: () => void
  male?: boolean
}

export const ListingTableHeader = ({
  simple,
  entity,
  topSelects = [],
  searchValue = '',
  onSearchChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  loading = false,
  includeHref,
  includeLabel,
  includeOnClick,
  male
}: ListingTableHeaderProps) => {
  const sizeCollection = React.useMemo(
    () => createListCollection({ items: pageSizeOptions.map((n) => ({ label: String(n), value: String(n) })) }),
    [pageSizeOptions]
  )
  const topCollections = React.useMemo<Record<string, ListCollection<Option>>>(() => {
    return topSelects.reduce<Record<string, ListCollection<Option>>>((acc, s) => {
      acc[s.id] = createListCollection<Option>({ items: s.options })
      return acc
    }, {})
  }, [topSelects])
  return (
    <>
      <Stack align={simple ? 'center' : 'start'} m={6} justify="space-between" direction={simple ? 'row' : 'column'}>
        <Heading size="md" fontWeight="medium">
          {!simple ? `Filtragem de ${entity}` : `${sentenceCase(entity)}`}
        </Heading>
        {simple && (
          <HStack>
            <ListingTableHeaderInputSearch entity={entity} searchValue={searchValue} onSearchChange={onSearchChange} />
            <ListingTableHeaderAddButton
              simple={simple}
              entity={entity}
              includeHref={includeHref}
              includeLabel={includeLabel}
              includeOnClick={includeOnClick}
              male={male}
            />
          </HStack>
        )}

        {!!topSelects.length && (
          <HStack>
            <For each={topSelects}>
              {(s) => {
                const col = topCollections[s.id]
                return (
                  <Select.Root
                    key={s.id}
                    collection={col}
                    value={[s.value ?? '']} // <- string, não array
                    onValueChange={(d) => {
                      const v = Array.isArray(d.value) ? d.value[0] : d.value
                      s.onChange(v || undefined)
                    }}
                    disabled={loading}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder={s.label} />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          <For each={col.items}>
                            {(item, index) => (
                              <Select.Item key={index} item={item}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            )}
                          </For>
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )
              }}
            </For>
          </HStack>
        )}
      </Stack>

      <Separator />

      {/* SEGUNDA LINHA: page size + search + botão */}
      {!simple && (
        <>
          <Stack m={6}>
            <HStack justify="space-between">
              <Select.Root
                collection={sizeCollection}
                defaultValue={[String(defaultPageSize)]}
                onValueChange={(d) => onPageSizeChange(Number(d.value))}
                w="20"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      <For each={sizeCollection.items}>
                        {(opt) => (
                          <Select.Item key={opt.value} item={opt}>
                            {opt.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        )}
                      </For>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>

              <HStack>
                <ListingTableHeaderInputSearch
                  entity={entity}
                  searchValue={searchValue}
                  onSearchChange={onSearchChange}
                />
                <ListingTableHeaderAddButton
                  entity={entity}
                  includeHref={includeHref}
                  includeLabel={includeLabel}
                  includeOnClick={includeOnClick}
                  male={male}
                />
              </HStack>
            </HStack>
          </Stack>
          <Separator />
        </>
      )}
    </>
  )
}

const ListingTableHeaderInputSearch = ({
  size,
  entity,
  searchValue,
  onSearchChange
}: {
  size?: 'md' | 'sm' | 'lg' | 'xl' | '2xl' | '2xs'
  entity?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
}) => {
  return (
    <Input
      size={size}
      placeholder={`Buscar ${entity}`}
      value={searchValue}
      onChange={(e) => onSearchChange?.(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSearchChange?.((e.target as HTMLInputElement).value)
      }}
    />
  )
}

const ListingTableHeaderAddButton = ({
  simple,
  entity,
  includeHref,
  includeLabel,
  includeOnClick,
  male = true
}: {
  simple?: boolean
  entity: string
  includeHref?: string
  includeLabel?: string
  includeOnClick?: () => void
  male?: boolean
}) => {
  if (!includeHref && !includeOnClick) return null

  const label = (includeLabel ?? male) ? `Novo ${entity}` : `Nova ${entity}`

  if (includeOnClick) {
    return !simple ? (
      <Button onClick={includeOnClick}>
        <BiPlus />
        {label}
      </Button>
    ) : (
      <IconButton aria-label={label} onClick={includeOnClick}>
        <BiPlus />
      </IconButton>
    )
  }
  return (
    <NextLink href={includeHref!}>
      {!simple ? (
        <Button>
          <BiPlus />
          {label}
        </Button>
      ) : (
        <IconButton>
          <BiPlus />
        </IconButton>
      )}
    </NextLink>
  )
}
