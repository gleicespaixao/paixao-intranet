import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { ControlledInputDate } from '@/components/controlled-input/date'
import { ControlledSelect } from '@/components/controlled-select/controlled-select'
import { ControlledSelectAsync } from '@/components/controlled-select/controlled-select-async'
import { DevelopmentForm } from '@/schemas/development'
import { fetchRealEstateDeveloper } from '@/services/real-estate-developer'
import { DEVELOPMENT_PHASE_OPTIONS } from '@/utils/development-phase'
import { STATUS_OPTIONS } from '@/utils/status'
import { Card, Grid, GridItem, Heading, Stack } from '@chakra-ui/react'
import { Control, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<DevelopmentForm>
  errors: FieldErrors<DevelopmentForm>
}

export function DevelopmentViewInfo({ control, errors }: Props) {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Informações do projeto
        </Heading>

        <Stack gap={4} mt={4}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <ControlledSelect
              name="status"
              control={control}
              label="Status"
              error={errors.status?.message}
              items={STATUS_OPTIONS}
            />
            <ControlledSelectAsync
              label="Incorporadora"
              name="realEstateDeveloper"
              control={control}
              required
              multiple
              error={errors.realEstateDeveloper?.message}
              loadOptions={async () => {
                const res = await fetchRealEstateDeveloper({})
                if (res.success && res.data) {
                  return res.data.records.map((c) => ({
                    label: c.name,
                    value: c.id,
                    isDisabled: !c.status
                  }))
                }
                return []
              }}
            />
          </Grid>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <ControlledInput
              required
              name="name"
              control={control}
              label="Nome do projeto"
              error={errors.name?.message}
            />
          </GridItem>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <ControlledSelect
              name="phase"
              control={control}
              required
              label="Fase"
              error={errors.phase?.message}
              items={DEVELOPMENT_PHASE_OPTIONS}
            />
            <ControlledInputDate
              name="releaseDate"
              control={control}
              label="Data de entrega"
              placeholder="MMMM/AAAA"
              format="MMMM/YYYY"
              onlyMonthPicker
              error={errors.releaseDate?.message}
            />
          </Grid>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
