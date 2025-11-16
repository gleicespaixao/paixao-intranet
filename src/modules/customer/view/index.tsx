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
import { CustomerViewRelationship } from './relationship'
import { CustomerViewCompany } from './company'
import { ControlledDeleteButton } from '@/components/dialog/controled/controlled-delete'
import { toaster } from '@/components/ui/toaster'
import { useRouter } from 'next/router'
import { deleteCustomer } from '@/services/customer'

export const ModuleCustomerView = ({
  customer,
  onCustomerChange
}: {
  customer: ApiCustomer
  onCustomerChange?: (customer: ApiCustomer) => void
}) => {
  const router = useRouter()
  return (
    <>
      <PageHeader
        title={`ID do cliente: ${customer?.token}`}
        subtitle={formatDateLong(customer?.logs.inclusion?.date)}
        backButton
        backButtonLink="/customer"
        rightSlot={
          <ControlledDeleteButton
            data={customer}
            entity="cliente"
            itemName={customer.name}
            onDelete={async ({ id }) => await deleteCustomer(id)}
            renderTrigger={(open, loading) => (
              <Button onClick={open} colorPalette="red" loading={loading}>
                Excluir cliente
              </Button>
            )}
            onError={() =>
              toaster.create({
                title: 'Ocorreu um erro ao excluir o cliente',
                type: 'error'
              })
            }
            redirectTo="/customer"
            navigate={(to) => router.push(to)}
          />
        }
      />
      <Stack gap={4}>
        <Stack w="full" gap={4} align="top" direction={{ base: 'column', xl: 'row' }}>
          <CustomerViewInfo customer={customer} onCustomerChange={onCustomerChange} />
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
                  <CustomerViewPurchaseHistory customer={customer} onCustomerChange={onCustomerChange} />
                  <CustomerViewCompany customer={customer} />
                  <CustomerViewRelationship customer={customer} />
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
