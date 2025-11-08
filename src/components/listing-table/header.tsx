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
  Stack
} from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { TopSelectConfig, Option } from '.'

export type ListingTableHeaderProps = {
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
}

export const ListingTableHeader = ({
  entity,
  topSelects = [],
  searchValue = '',
  onSearchChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  loading = false,
  includeHref,
  includeLabel
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
      <Stack m={6}>
        <Heading size="md" fontWeight="medium">
          Filtragem de {entity}
        </Heading>

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
      <Stack m={6}>
        <HStack justify="space-between">
          <Select.Root
            collection={sizeCollection}
            defaultValue={[String(defaultPageSize)]}
            onValueChange={(d) => onPageSizeChange(Number(d.value))}
            w="20"
            disabled={loading}
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
            <Input
              placeholder={`Buscar ${entity}`}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              // não desabilite; deixe o usuário continuar digitando
              aria-busy={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearchChange?.((e.target as HTMLInputElement).value)
              }}
            />
            {includeHref && (
              <NextLink href={includeHref}>
                <Button>
                  <BiPlus />
                  {includeLabel ?? `Novo ${entity}`}
                </Button>
              </NextLink>
            )}
          </HStack>
        </HStack>
      </Stack>

      <Separator />
    </>
  )
}
