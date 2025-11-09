'use client'

import { ApiCustomer } from '@/@types/api-customer'
import { PageHeader } from '@/components/layout/page-header'
import { Button, Stack, Tabs } from '@chakra-ui/react'
import { BiFile, BiUser } from 'react-icons/bi'
import { CustomerViewInfo } from './info'
import { formatDateLong } from '@/utils/date-converter'
import { CustomerViewPurchaseProfile } from './purchase-profile'
import { CustomerViewAddress } from './address'
import { CustomerViewPurchaseHistory } from './purchase-history'

export const ModuleCustomerView = ({ customer }: { customer: ApiCustomer }) => {
  return (
    <>
      <PageHeader
        title={`ID do cliente: ${customer?.token}`}
        subtitle={formatDateLong(customer?.logs.inclusion?.date)}
        backButton
        backButtonLink="/customer"
        rightSlot={<Button colorPalette="red">Excluir cliente</Button>}
      />
      <Stack gap={4}>
        <Stack w="full" gap={4} align="top" direction={{ base: 'column', xl: 'row' }}>
          <CustomerViewInfo customer={customer} />
          <Stack w="full">
            <Tabs.Root defaultValue="info" variant="subtle">
              <Tabs.List>
                <Tabs.Trigger value="info">
                  <BiUser />
                  Visão geral
                </Tabs.Trigger>
                <Tabs.Trigger value="docs">
                  <BiFile />
                  Documentos
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="info">
                <Stack gap={4}>
                  <CustomerViewPurchaseProfile customer={customer} />
                  <CustomerViewAddress customer={customer} />
                  <CustomerViewPurchaseHistory customer={customer} />
                  {/* <Card.Root>
                    <Card.Body p={0}>
                      <ListingTable
                        simple={true}
                        entity="empresas"
                        rows={[]}
                        columns={[]}
                        page={0}
                        pageSize={0}
                        totalCount={0}
                        onPageChange={function (page: number): void {
                          throw new Error('Function not implemented.')
                        }}
                        onPageSizeChange={function (size: number): void {
                          throw new Error('Function not implemented.')
                        }}
                        includeHref="sd"
                      />
                    </Card.Body>
                  </Card.Root> */}
                  {/* <Card.Root>
                    <Card.Body p={0}>
                      <ListingTable
                        simple={true}
                        entity="relacionamentos"
                        rows={[]}
                        columns={[]}
                        page={0}
                        pageSize={0}
                        totalCount={0}
                        onPageChange={function (page: number): void {
                          throw new Error('Function not implemented.')
                        }}
                        onPageSizeChange={function (size: number): void {
                          throw new Error('Function not implemented.')
                        }}
                        includeHref="sd"
                      />
                    </Card.Body>
                  </Card.Root> */}
                </Stack>
              </Tabs.Content>
              <Tabs.Content value="docs">Manage your projects</Tabs.Content>
            </Tabs.Root>
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
