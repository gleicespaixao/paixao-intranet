import { ApiCustomer } from '@/@types/api-customer'
import { BEDROOM_MAP } from '@/utils/bedroom'
import { GARAGE_MAP } from '@/utils/garage'
import { PURCHASE_GOALS_MAP } from '@/utils/purchase-goals'
import { Badge, Card, Heading, HStack, Stack, StackSeparator, Text } from '@chakra-ui/react'
import { BiBuildingHouse, BiCar, BiHome, BiHotel, BiTargetLock } from 'react-icons/bi'

export const CustomerViewPurchaseProfile = ({ customer }: { customer?: ApiCustomer }) => {
  const profile = customer?.propertyProfile

  const goal = profile?.purchaseGoals?.map((g) => PURCHASE_GOALS_MAP[g].label).join(', ') ?? 'Sem preferência'
  const bedroom = profile?.bedrooms?.map((g) => BEDROOM_MAP[g].label).join(', ') ?? 'Sem preferência'
  const garage = profile?.garage?.map((g) => GARAGE_MAP[g].label).join(', ') ?? 'Sem preferência'

  const types = profile?.typeOfProperty ?? []
  const neighborhoods = profile?.neighborhood ?? []

  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Perfil de compra
        </Heading>

        <Stack mt={4} gap={3}>
          {/* Objetivo de compra */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiTargetLock />
            <Text fontWeight="medium" minW="fit-content">
              Objetivo de compra:
            </Text>
            <HStack separator={<StackSeparator />}>
              <Text>{goal}</Text>
            </HStack>
          </HStack>

          {/* Tipo de propriedade */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiHome />
            <Text fontWeight="medium" minW="fit-content">
              Tipo:
            </Text>
            {types.length ? (
              <HStack separator={<StackSeparator />} wrap="wrap">
                {types.map((t, i) => (
                  <Text key={i}>{t.name}</Text>
                ))}
              </HStack>
            ) : (
              <Text>Sem preferência</Text>
            )}
          </HStack>

          {/* Dormitórios */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiHotel />
            <Text fontWeight="medium" minW="fit-content">
              Dormitórios:
            </Text>
            <HStack separator={<StackSeparator />}>
              <Text>{bedroom}</Text>
            </HStack>
          </HStack>

          {/* Garagem */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiCar />
            <Text fontWeight="medium" minW="fit-content">
              Garagem:
            </Text>
            <HStack separator={<StackSeparator />}>
              <Text>{garage}</Text>
            </HStack>
          </HStack>

          {/* Bairros */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiBuildingHouse />
            <Text fontWeight="medium" minW="fit-content">
              Bairros de interesse:
            </Text>
            {neighborhoods.length ? (
              <HStack gap={2} wrap="wrap">
                {neighborhoods.map((n, i) => (
                  <Badge key={i}>{n.name}</Badge>
                ))}
              </HStack>
            ) : (
              <Text>Sem preferência</Text>
            )}
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
