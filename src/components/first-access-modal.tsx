import { useMemo, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, Button, Fieldset, Stack, Text, Alert } from '@chakra-ui/react'
import { ControlledPasswordInput } from '@/components/controlled-input/controlled-password-input'
import { updatePassword } from '@/services/authentication'
import { PasswordUpdateForm, schemaPasswordUpdate } from '@/schemas/password'

export function FirstAccessModal() {
  const { data: session } = useSession()
  const router = useRouter()

  const isFirstAccess = session?.user?.firstAccess === true
  const userEmail = session?.user?.email ?? ''

  const [completed, setCompleted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PasswordUpdateForm>({
    resolver: zodResolver(schemaPasswordUpdate),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' }
  })

  const open = isFirstAccess && !completed
  const canSubmit = useMemo(() => !!userEmail, [userEmail])

  const onSubmit = async ({ oldPassword, newPassword }: PasswordUpdateForm) => {
    setApiError(null)

    const res = await updatePassword({ oldPassword, newPassword })
    if (!res.success) {
      setApiError(res.error || 'Não foi possível atualizar a senha.')
      return
    }

    // relogar com a nova senha para atualizar a sessão
    const login = await signIn('credentials', {
      redirect: false,
      identifier: userEmail,
      password: newPassword
    })

    reset()
    setCompleted(true)

    if (login?.ok) {
      // permanece na página
    } else {
      await router.replace('/sign-in')
    }
  }

  if (!open) return null

  return (
    <Dialog.Root open>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Defina sua nova senha</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap="4" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Text color="fg.muted" fontSize="sm">
                Este é seu primeiro acesso. Troque a senha provisória enviada para <b>{userEmail}</b>.
              </Text>

              {apiError && (
                <Alert.Root status="error" borderRadius="md">
                  <Alert.Indicator />
                  {apiError}
                </Alert.Root>
              )}

              <Fieldset.Root gap="2">
                <ControlledPasswordInput<PasswordUpdateForm>
                  name="oldPassword"
                  control={control}
                  label="Senha provisória"
                  error={errors.oldPassword?.message}
                  autoFocus
                />

                <ControlledPasswordInput<PasswordUpdateForm>
                  name="newPassword"
                  control={control}
                  label="Nova senha"
                  error={errors.newPassword?.message}
                  showStrengthMeter
                />

                <ControlledPasswordInput<PasswordUpdateForm>
                  name="confirmPassword"
                  control={control}
                  label="Confirmar nova senha"
                  showStrengthMeter
                  error={errors.confirmPassword?.message}
                />
              </Fieldset.Root>

              <Button type="submit" colorPalette="teal" loading={isSubmitting} disabled={isSubmitting || !canSubmit}>
                Atualizar senha e continuar
              </Button>
            </Stack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
