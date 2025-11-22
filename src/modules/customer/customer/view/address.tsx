import { ApiCustomer } from '@/@types/api-customer'
import { Card, Heading, HStack, Stack, StackSeparator, Text } from '@chakra-ui/react'
import { BiBuilding, BiMap, BiMapAlt, BiMapPin } from 'react-icons/bi'

const formatCEP = (v?: string | number) => {
  if (v == null) return '—'
  const d = String(v).replace(/\D/g, '').slice(0, 8)
  if (d.length < 8) return d // parcial durante carregamento/inputs
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export const CustomerViewAddress = ({ customer }: { customer?: ApiCustomer }) => {
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
            <Text>{cep}</Text>
          </HStack>

          <HStack align="center" gap={2} wrap="wrap">
            <BiMapAlt />
            <Text fontWeight="medium" minW="fit-content">
              Endereço:
            </Text>
            <Text>{endereco}</Text>
          </HStack>

          <HStack align="center" gap={2} wrap="wrap">
            <BiMap />
            <Text fontWeight="medium" minW="fit-content">
              Complemento:
            </Text>
            <Text>{complemento}</Text>
          </HStack>

          <HStack align="center" wrap="wrap" separator={<StackSeparator />}>
            <HStack align="center" gap={2}>
              <BiBuilding />
              <Text fontWeight="medium" minW="fit-content">
                Bairro:
              </Text>
              <Text>{bairro}</Text>
            </HStack>

            <HStack align="center" gap={2}>
              <Text fontWeight="medium" minW="fit-content">
                Cidade:
              </Text>
              <Text>{cidade}</Text>
            </HStack>

            <HStack align="center" gap={2}>
              <Text fontWeight="medium" minW="fit-content">
                Estado:
              </Text>
              <Text textTransform="uppercase">{uf}</Text>
            </HStack>
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
