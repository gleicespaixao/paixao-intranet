import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { schemaResetPassword, type ResetPasswordForm } from '@/schemas/password'
import { Box, Button, Card, Heading, Input, Field, Fieldset } from '@chakra-ui/react'
import { Form } from '@/components/form'
import { Seo } from '@/components/seo'
import { withGuestGSSP } from '@/server/guest-ssr'

type ApiAuthResponse = {
  token: string
  expiration: string
  adminAccess: boolean
  user: { email: string; name?: string; surname?: string; id: string }
}

export const getServerSideProps = withGuestGSSP()()

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token: tokenFromQuery } = router.query as { token?: string }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(schemaResetPassword),
    defaultValues: { password: '', confirmPassword: '', token: '' }
  })

  useEffect(() => {
    if (tokenFromQuery) setValue('token', tokenFromQuery)
  }, [tokenFromQuery, setValue])

  const onSubmit = async ({ password, token }: ResetPasswordForm) => {
    try {
      const { data } = await api.post<ApiAuthResponse>('/Authentication/reset-password', { password, token })
      // Login automático com NextAuth Credentials usando o e-mail retornado + nova senha
      const res = await signIn('credentials', {
        redirect: false,
        identifier: data.user.email,
        password
      })
      if (res?.ok) {
        await router.replace('/dashboard')
      } else {
        // fallback: se por algum motivo não logar, manda para a tela de login
        await router.replace('/auth/signin')
      }
    } catch (err) {
      const msg = getApiErrorMessage(err) ?? 'Falha ao redefinir a senha.'
      alert(msg) // você pode trocar por <Alert /> no card, se preferir um estado local
    }
  }

  return (
    <Box minH="100dvh" display="grid" placeItems="center" p="6">
      <Seo title="Redefinir senha" noIndex />
      <Card.Root w="full" maxW="sm">
        <Card.Body>
          <Form<ResetPasswordForm> w="full" maxW="md" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
            <Heading size="lg" textAlign="center">
              Redefinir senha
            </Heading>

            <Fieldset.Root>
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Nova senha</Field.Label>
                <Input {...register('password')} type="password" placeholder="Sua nova senha" autoFocus />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.confirmPassword}>
                <Field.Label>Confirmar senha</Field.Label>
                <Input {...register('confirmPassword')} type="password" placeholder="Confirme a nova senha" />
                <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.token}>
                <Field.Label>Token</Field.Label>
                <Input {...register('token')} placeholder="Cole aqui o token recebido por e-mail" />
                <Field.ErrorText>{errors.token?.message}</Field.ErrorText>
              </Field.Root>
            </Fieldset.Root>

            <Button type="submit" colorPalette="teal" loading={isSubmitting} disabled={isSubmitting}>
              Redefinir e entrar
            </Button>
          </Form>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}
