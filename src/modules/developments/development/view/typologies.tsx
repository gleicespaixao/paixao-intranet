import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { ControlledInputNumber } from '@/components/controlled-input/controlled-input-number'
import { DevelopmentForm } from '@/schemas/development'
import { Card, Grid, GridItem, Heading, HStack, Separator, Stack, Text } from '@chakra-ui/react'
import { Control, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<DevelopmentForm>
  errors: FieldErrors<DevelopmentForm>
}

export function DevelopmentViewTypologies({ control, errors }: Props) {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Tipologias
        </Heading>

        <Stack gap={10} mt={4}>
          <Stack>
            <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
              <Separator flex="1" />
              <Text flexShrink="0" fontSize="sm">
                Studio
              </Text>
              <Separator flex="1" />
            </GridItem>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
              <ControlledInputNumber
                name="typology.studio.quantity"
                label="Quantidade"
                control={control}
                min={0}
                controlChevron
                error={errors.typology?.studio?.quantity?.message}
              />

              <ControlledInput
                name="typology.studio.floorPlan"
                control={control}
                label="Planta"
                error={errors.typology?.studio?.floorPlan?.message}
                endElement="m²"
              />
            </Grid>
          </Stack>
          <Stack>
            <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
              <Separator flex="1" />
              <Text flexShrink="0" fontSize="sm">
                1 Dormitório
              </Text>
              <Separator flex="1" />
            </GridItem>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
              <ControlledInputNumber
                name="typology.one_bedroom.quantity"
                label="Quantidade"
                control={control}
                min={0}
                controlChevron
                error={errors.typology?.one_bedroom?.quantity?.message}
              />

              <ControlledInput
                name="typology.one_bedroom.floorPlan"
                control={control}
                label="Planta"
                error={errors.typology?.one_bedroom?.floorPlan?.message}
                endElement="m²"
              />
            </Grid>
          </Stack>
          <Stack>
            <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
              <Separator flex="1" />
              <Text flexShrink="0" fontSize="sm">
                2 Dormitórios
              </Text>
              <Separator flex="1" />
            </GridItem>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
              <ControlledInputNumber
                name="typology.two_bedroom.quantity"
                label="Quantidade"
                control={control}
                min={0}
                controlChevron
                error={errors.typology?.two_bedroom?.quantity?.message}
              />

              <ControlledInput
                name="typology.two_bedroom.floorPlan"
                control={control}
                label="Planta"
                error={errors.typology?.two_bedroom?.floorPlan?.message}
                endElement="m²"
              />
            </Grid>
          </Stack>
          <Stack>
            <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
              <Separator flex="1" />
              <Text flexShrink="0" fontSize="sm">
                3 Dormitórios
              </Text>
              <Separator flex="1" />
            </GridItem>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
              <ControlledInputNumber
                name="typology.three_bedroom.quantity"
                label="Quantidade"
                control={control}
                min={0}
                controlChevron
                error={errors.typology?.three_bedroom?.quantity?.message}
              />

              <ControlledInput
                name="typology.three_bedroom.floorPlan"
                control={control}
                label="Planta"
                error={errors.typology?.three_bedroom?.floorPlan?.message}
                endElement="m²"
              />
            </Grid>
          </Stack>
          <Stack>
            <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
              <Separator flex="1" />
              <Text flexShrink="0" fontSize="sm">
                4 Dormitórios
              </Text>
              <Separator flex="1" />
            </GridItem>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
              <ControlledInputNumber
                name="typology.four_bedroom.quantity"
                label="Quantidade"
                control={control}
                min={0}
                controlChevron
                error={errors.typology?.four_bedroom?.quantity?.message}
              />

              <ControlledInput
                name="typology.four_bedroom.floorPlan"
                control={control}
                label="Planta"
                error={errors.typology?.four_bedroom?.floorPlan?.message}
                endElement="m²"
              />
            </Grid>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
