import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Card, Grid, Heading, Stack, Text, Fieldset, Alert } from '@chakra-ui/react'

import { ControlledPasswordInput } from '@/components/controlled-input/controlled-password-input'
import { toaster } from '@/components/ui/toaster'
import { updatePassword } from '@/services/authentication'
import { InternalPasswordUpdateForm, schemaInternalPasswordUpdate } from '@/schemas/password'
import { Form } from '@/components/form'

export const ModuleProfilePassword = () => {
  const {
    control: pwControl,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetPw
  } = useForm<InternalPasswordUpdateForm>({
    resolver: zodResolver(schemaInternalPasswordUpdate),
    defaultValues: { currentPassword: '', newPassword: '' }
  })
  const [pwError, setPwError] = React.useState<string | null>(null)

  const onSubmit = async ({ currentPassword, newPassword }: InternalPasswordUpdateForm) => {
    setPwError(null)
    const res = await updatePassword({ oldPassword: currentPassword, newPassword })
    if (!res.success) {
      setPwError(res.error)
      return
    }
    toaster.success({ title: 'Senha atualizada' })
    resetPw()
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '240px 1fr' }} gap="10" alignItems="start">
      {/* Lado esquerdo */}
      <Stack gap="1">
        <Heading size="md">Senha</Heading>
        <Text color="fg.muted">Altere sua senha de acesso</Text>
      </Stack>

      {/* Lado direito */}
      <Card.Root>
        <Card.Body>
          <Form w="full" gap="4" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
            {pwError && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                {pwError}
              </Alert.Root>
            )}

            <Fieldset.Root gap="3">
              <ControlledPasswordInput<InternalPasswordUpdateForm>
                name="currentPassword"
                control={pwControl}
                label="Senha antiga"
                error={errors.currentPassword?.message}
                autoComplete="current-password"
              />
            </Fieldset.Root>

            <Fieldset.Root gap="3">
              <ControlledPasswordInput<InternalPasswordUpdateForm>
                name="newPassword"
                control={pwControl}
                label="Senha nova"
                error={errors.newPassword?.message}
                showStrengthMeter
                autoComplete="new-password"
              />
            </Fieldset.Root>

            <Button type="submit" loading={isSubmitting} disabled={isSubmitting} alignSelf="start">
              Salvar
            </Button>
          </Form>
        </Card.Body>
      </Card.Root>
    </Grid>
  )
}
