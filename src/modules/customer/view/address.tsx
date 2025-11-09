import { ApiCustomer } from '@/@types/api-customer'
import { Card, Heading, HStack, Skeleton, Stack, StackSeparator, Text } from '@chakra-ui/react'
import { BiBuilding, BiMap, BiMapAlt, BiMapPin } from 'react-icons/bi'

const formatCEP = (v?: string | number) => {
  if (v == null) return '—'
  const d = String(v).replace(/\D/g, '').slice(0, 8)
  if (d.length < 8) return d // parcial durante carregamento/inputs
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export const CustomerViewAddress = ({ customer, loading }: { customer?: ApiCustomer; loading: boolean }) => {
  const addr = customer?.address
  const cep = formatCEP(addr?.postalCode)
  const endereco = [addr?.street, addr?.streetNumber].filter(Boolean).join(', ') || '—'
  const complemento = addr?.addressLine || '—'
  const bairro = addr?.neighborhood || '—'
  const cidade = addr?.city || '—'
  const uf = addr?.state || '—'

  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Endereço
        </Heading>

        <Stack mt={4} gap={3}>
          <HStack align="center" gap={2}>
            <BiMapPin />
            <Text fontWeight="medium" minW="fit-content">
              CEP:
            </Text>
            <Skeleton loading={loading} display="inline-block" minW="100px">
              <Text>{cep}</Text>
            </Skeleton>
          </HStack>

          <HStack align="center" gap={2} wrap="wrap">
            <BiMapAlt />
            <Text fontWeight="medium" minW="fit-content">
              Endereço:
            </Text>
            <Skeleton loading={loading} display="inline-block" minW="220px">
              <Text>{endereco}</Text>
            </Skeleton>
          </HStack>

          <HStack align="center" gap={2} wrap="wrap">
            <BiMap />
            <Text fontWeight="medium" minW="fit-content">
              Complemento:
            </Text>
            <Skeleton loading={loading} display="inline-block" minW="240px">
              <Text>{complemento}</Text>
            </Skeleton>
          </HStack>

          <HStack align="center" wrap="wrap" separator={<StackSeparator />}>
            <HStack align="center" gap={2}>
              <BiBuilding />
              <Text fontWeight="medium" minW="fit-content">
                Bairro:
              </Text>
              <Skeleton loading={loading} display="inline-block">
                <Text>{bairro}</Text>
              </Skeleton>
            </HStack>

            <HStack align="center" gap={2}>
              <Text fontWeight="medium" minW="fit-content">
                Cidade:
              </Text>
              <Skeleton loading={loading} display="inline-block">
                <Text>{cidade}</Text>
              </Skeleton>
            </HStack>

            <HStack align="center" gap={2}>
              <Text fontWeight="medium" minW="fit-content">
                Estado:
              </Text>
              <Skeleton loading={loading} display="inline-block">
                <Text textTransform="uppercase">{uf}</Text>
              </Skeleton>
            </HStack>
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
