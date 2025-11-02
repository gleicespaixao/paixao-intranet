import { useMemo, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { schemaUpdatePassword, type UpdatePasswordForm } from '@/schemas/password'
import { Dialog, Button, Field, Fieldset, Input, Stack, Text, Alert } from '@chakra-ui/react'

export function FirstAccessModal() {
  const { data: session } = useSession()
  const router = useRouter()

  const isFirstAccess = session?.user?.firstAccess === true
  const userEmail = session?.user?.email ?? ''

  // flag local para esconder o modal depois do fluxo completar
  const [completed, setCompleted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(schemaUpdatePassword),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' }
  })

  // ✅ Deriva o estado "open" sem setState em effect
  const open = isFirstAccess && !completed
  const canSubmit = useMemo(() => !!userEmail, [userEmail])

  const onSubmit = async ({ oldPassword, newPassword }: UpdatePasswordForm) => {
    setApiError(null)
    try {
      await api.post('/Authentication/update-password', { oldPassword, newPassword })

      // Reloga com a nova senha para atualizar a sessão
      const res = await signIn('credentials', {
        redirect: false,
        identifier: userEmail,
        password: newPassword
      })

      reset()
      setCompleted(true) // fecha o modal (open passa a ser false)

      if (res?.ok) {
        // permanece ou redireciona se quiser
        // await router.replace('/dashboard')
      } else {
        await router.replace('/signin')
      }
    } catch (err) {
      setApiError(getApiErrorMessage(err) ?? 'Não foi possível atualizar a senha.')
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
            {/* Remova o CloseTrigger se quiser tornar o modal obrigatório */}
            {/* <Dialog.CloseTrigger aria-label="Fechar" /> */}
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

              <Fieldset.Root>
                <Field.Root invalid={!!errors.oldPassword}>
                  <Field.Label>Senha provisória</Field.Label>
                  <Input {...register('oldPassword')} type="password" autoFocus />
                  <Field.ErrorText>{errors.oldPassword?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.newPassword}>
                  <Field.Label>Nova senha</Field.Label>
                  <Input {...register('newPassword')} type="password" />
                  <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.confirmPassword}>
                  <Field.Label>Confirmar nova senha</Field.Label>
                  <Input {...register('confirmPassword')} type="password" />
                  <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                </Field.Root>
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
