import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { ControlledSelectAsync } from '@/components/controlled-select/controlled-select-async'
import { DevelopmentForm } from '@/schemas/development'
import { fetchLeisure } from '@/services/leisure'
import { fetchUnitType } from '@/services/unit-type'
import { Card, Grid, Heading, Stack } from '@chakra-ui/react'
import { Control, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<DevelopmentForm>
  errors: FieldErrors<DevelopmentForm>
}

export function DevelopmentViewTechnicalSpecifications({ control, errors }: Props) {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Ficha técnica
        </Heading>

        <Stack gap={4} mt={4}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <ControlledInput
              name="technicalSpecifications.floorPlan"
              control={control}
              label="Área do terreno"
              error={errors.technicalSpecifications?.floorPlan?.message}
              endElement="m²"
            />
            <ControlledSelectAsync
              label="Tipo de unidade"
              name="technicalSpecifications.unitType"
              control={control}
              multiple
              isFilter
              required
              error={errors.technicalSpecifications?.unitType?.message}
              loadOptions={async (_input, searchTxt = '', selected) => {
                // 1) excluir os já selecionados
                const excludeSelected =
                  selected?.map((s) => ({
                    field: 'id',
                    op: 'ne' as const,
                    value: s.value
                  })) ?? []

                // 2) se o usuário digitou algo, montar o lk no name
                const searchConds =
                  searchTxt.trim().length > 0
                    ? [
                        {
                          field: 'name',
                          op: 'lk' as const,
                          value: searchTxt.trim()
                        }
                      ]
                    : []

                const fixedConds = [...excludeSelected, ...searchConds]

                const res = await fetchUnitType({
                  fixedConds
                })

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
          <ControlledSelectAsync
            label="Lazer"
            name="technicalSpecifications.leisure"
            control={control}
            multiple
            isFilter
            error={errors.technicalSpecifications?.leisure?.message}
            loadOptions={async (_input, searchTxt = '', selected) => {
              // 1) excluir os já selecionados
              const excludeSelected =
                selected?.map((s) => ({
                  field: 'id',
                  op: 'ne' as const,
                  value: s.value
                })) ?? []

              // 2) se o usuário digitou algo, montar o lk no name
              const searchConds =
                searchTxt.trim().length > 0
                  ? [
                      {
                        field: 'name',
                        op: 'lk' as const,
                        value: searchTxt.trim()
                      }
                    ]
                  : []

              const fixedConds = [...excludeSelected, ...searchConds]

              const res = await fetchLeisure({
                fixedConds
              })

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
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
