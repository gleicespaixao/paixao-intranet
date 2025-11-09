import { ApiCustomer } from '@/@types/api-customer'
import { Badge, Card, Heading, HStack, Stack, StackSeparator, Text } from '@chakra-ui/react'
import { BiBuildingHouse, BiCar, BiHome, BiHotel, BiTargetLock } from 'react-icons/bi'

// helpers
const tPurchaseGoal = (g?: ApiCustomer['propertyProfile']['purchaseGoals']) =>
  g === 'residence' ? 'Moradia' : g === 'investment' ? 'Investimento' : 'Sem preferência'

const tBedrooms = (b?: ApiCustomer['propertyProfile']['bedrooms']) =>
  b === 'one' ? '1' : b === 'two' ? '2' : b === 'three' ? '3' : b === 'four_plus' ? '4+' : 'Sem preferência'

const tGarage = (g?: ApiCustomer['propertyProfile']['garage']) =>
  g === 'one' ? '1' : g === 'two' ? '2' : g === 'three' ? '3' : g === 'four_plus' ? '4+' : 'Sem preferência'

const getLinkLabel = (x: unknown) => {
  if (x && typeof x === 'object') {
    const anyx = x as { label?: string; name?: string }
    return anyx.label ?? anyx.name ?? 'Sem preferência'
  }
  return 'Sem preferência'
}

export const CustomerViewPurchaseProfile = ({ customer }: { customer?: ApiCustomer }) => {
  const profile = customer?.propertyProfile
  const goal = tPurchaseGoal(profile?.purchaseGoals)
  const bedrooms = tBedrooms(profile?.bedrooms)
  const garage = tGarage(profile?.garage)
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

          {/* Tipo de imóvel */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiHome />
            <Text fontWeight="medium" minW="fit-content">
              Tipo:
            </Text>
            {types.length ? (
              <HStack separator={<StackSeparator />} wrap="wrap">
                {types.map((t, i) => (
                  <Text key={i}>{getLinkLabel(t)}</Text>
                ))}
              </HStack>
            ) : (
              <Text>—</Text>
            )}
          </HStack>

          {/* Dormitórios */}
          <HStack align="center" wrap="wrap" gap={2}>
            <BiHotel />
            <Text fontWeight="medium" minW="fit-content">
              Dormitórios:
            </Text>
            <HStack separator={<StackSeparator />}>
              <Text>{bedrooms}</Text>
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
                  <Badge key={i}>{getLinkLabel(n)}</Badge>
                ))}
              </HStack>
            ) : (
              <Text>—</Text>
            )}
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
