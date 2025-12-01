import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { DevelopmentForm } from '@/schemas/development'
import { Card, Heading, Stack } from '@chakra-ui/react'
import { Control, FieldErrors } from 'react-hook-form'

type Props = {
  control: Control<DevelopmentForm>
  errors: FieldErrors<DevelopmentForm>
}

export function DevelopmentViewProjectTeam({ control, errors }: Props) {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Responsáveis
        </Heading>

        <Stack gap={4} mt={4}>
          <ControlledInput
            name="projectTeam.architecture"
            control={control}
            label="Projeto de arquitetura"
            error={errors.projectTeam?.architecture?.message}
          />
          <ControlledInput
            name="projectTeam.interiorDesign"
            control={control}
            label="Projeto de decoração"
            error={errors.projectTeam?.interiorDesign?.message}
          />
          <ControlledInput
            name="projectTeam.landscaping"
            control={control}
            label="Projeto de paisagismo"
            error={errors.projectTeam?.landscaping?.message}
          />
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
