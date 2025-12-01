import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { DevelopmentForm } from '@/schemas/development'
import { Button, Card, Grid, GridItem, Heading, IconButton, Stack } from '@chakra-ui/react'
import { Control, FieldErrors, useFieldArray } from 'react-hook-form'
import { BiTrashAlt } from 'react-icons/bi'

type Props = {
  control: Control<DevelopmentForm>
  errors: FieldErrors<DevelopmentForm>
}

export function DevelopmentViewDistances({ control, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'distance'
  })
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Distâncias
        </Heading>

        <Stack gap={4} mt={4}>
          {fields.map((field, index) => (
            <Grid key={field.id} templateColumns={{ base: '1fr', md: '1fr auto' }} gap={3} alignItems="flex-end">
              <ControlledInput
                name={`distance.${index}.distance` as const}
                control={control}
                placeholder="Ex.: 650m da Estação Praça da Árvore"
                label={`Localização ${fields.length === 1 ? '' : ` ${index + 1}`}`}
                error={errors.projectTeam?.architecture?.message}
              />
              <GridItem>
                <IconButton
                  aria-label="Excluir distância"
                  colorPalette="red"
                  variant="outline"
                  onClick={() => remove(index)}
                >
                  <BiTrashAlt />
                </IconButton>
              </GridItem>
            </Grid>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              append({ distance: '' })
            }}
          >
            Adicionar distância
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
