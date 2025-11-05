import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { schemaResetPassword, type ResetPasswordForm } from '@/schemas/password'
import { Box, Button, Card, Heading, Fieldset, Alert, Text, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Form } from '@/components/form'
import { Seo } from '@/components/seo'
import { withGuestGSSP } from '@/server/guest-ssr'
import { ControlledPasswordInput } from '@/components/controlled-password-input'
import { ControlledInput } from '@/components/controlled-input'
import { Logotipo } from '@/components/logotipo'
import { resetPassword } from '@/services/authentication'

export const getServerSideProps = withGuestGSSP()()

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token: tokenFromQuery } = router.query as { token?: string }
  const [errorMsg, setError] = useState<string | null>(null)

  const {
    control,
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
    setError(null)

    const res = await resetPassword({ password, token })
    if (!res.success) {
      setError(res.error || 'Falha ao redefinir a senha.')
      return
    }

    // login automático com o e-mail retornado + nova senha
    const login = await signIn('credentials', {
      redirect: false,
      identifier: res.data.user.email,
      password
    })

    if (login?.ok) {
      await router.replace('/dashboard')
    } else {
      await router.replace('/sign-in')
    }
  }

  return (
    <>
      <Seo title="Redefinir senha" noIndex />
      <Box minH="100dvh" display="grid" placeItems="center" p="6">
        <Card.Root w="full" maxW="md">
          <Card.Body>
            <Form<ResetPasswordForm> w="full" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
              <Stack gap={4}>
                <Stack align="center" gap="4" mb="6">
                  <Logotipo />
                  <Heading size="2xl" textAlign="center">
                    Redefinir senha do SisPa
                  </Heading>
                  <Text color="fg.muted" textAlign="center">
                    Defina sua nova senha para continuar
                  </Text>
                </Stack>

                {errorMsg && (
                  <Alert.Root status="error" borderRadius="md" mb="3">
                    <Alert.Indicator />
                    {errorMsg}
                  </Alert.Root>
                )}

                <Fieldset.Root gap="2">
                  <ControlledPasswordInput<ResetPasswordForm>
                    name="password"
                    control={control}
                    label="Nova senha"
                    error={errors.password?.message}
                    showStrengthMeter
                    autoFocus
                  />

                  <ControlledPasswordInput<ResetPasswordForm>
                    name="confirmPassword"
                    control={control}
                    label="Confirmar nova senha"
                    error={errors.confirmPassword?.message}
                    showStrengthMeter
                  />

                  <ControlledInput<ResetPasswordForm>
                    name="token"
                    control={control}
                    label="Token"
                    placeholder="Cole aqui o token recebido por e-mail"
                    error={errors.token?.message}
                  />
                </Fieldset.Root>

                <Button type="submit" colorPalette="teal" w="full" loading={isSubmitting} disabled={isSubmitting}>
                  Redefinir e entrar
                </Button>

                <Text fontSize="sm" textAlign="center">
                  Lembrou a senha?{' '}
                  <Link asChild colorPalette="teal">
                    <NextLink href="/sign-in">Voltar ao Login</NextLink>
                  </Link>
                </Text>
              </Stack>
            </Form>
          </Card.Body>
        </Card.Root>
      </Box>
    </>
  )
}
