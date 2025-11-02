import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Box, Button, Card, Heading, Text, Input, Alert, Field, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Form } from '@/components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginForm, schemaLogin } from '@/schemas/login'
import { withGuestGSSP } from '@/server/guest-ssr'
import { Seo } from '@/components/seo'

export const getServerSideProps = withGuestGSSP()()

export default function SignInPage() {
  const router = useRouter()
  const [errorMsg, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(schemaLogin),
    defaultValues: { identifier: '', password: '' }
  })

  const onSubmit = async ({ identifier, password }: LoginForm) => {
    setError(null)
    const res = await signIn('credentials', {
      redirect: false,
      identifier,
      password
    })

    if (!res) {
      setError('Falha inesperada. Tente novamente.')
      return
    }
    if (!res.ok) {
      // aqui deve chegar a mensagem do throw do authorize
      setError(res.error ?? 'Credenciais inválidas.')
      return
    }

    const callbackUrl = (router.query.callbackUrl as string) ?? '/dashboard'
    await router.replace(callbackUrl)
  }

  return (
    <>
      <Seo title="Login" noIndex />
      <Box minH="100dvh" display="grid" placeItems="center" p="6">
        <Card.Root w="full" maxW="sm">
          <Card.Body>
            <Form w="full" maxW="md" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
              <Heading size="lg" textAlign="center">
                Entrar
              </Heading>

              {errorMsg && (
                <Alert.Root status="error" borderRadius="md">
                  <Alert.Indicator />
                  {errorMsg}
                </Alert.Root>
              )}

              <Field.Root invalid={!!errors.identifier}>
                <Field.Label>Usuário ou e-mail</Field.Label>
                <Input {...register('identifier')} placeholder="seu.usuario ou email@dominio.com" autoFocus />
                <Field.ErrorText>{errors.identifier?.message}</Field.ErrorText>
              </Field.Root>

              {/* password */}
              <Field.Root invalid={!!errors.password}>
                <Field.Label>Senha</Field.Label>
                <Input {...register('password')} type="password" placeholder="••••••" />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              </Field.Root>
              <Text mt="3" fontSize="sm">
                <Link asChild colorPalette="teal">
                  <NextLink href="/forgot-password">Esqueci minha senha</NextLink>
                </Link>
              </Text>

              <Button type="submit" colorPalette="teal" loading={isSubmitting} disabled={isSubmitting}>
                Entrar
              </Button>
            </Form>
          </Card.Body>
        </Card.Root>
      </Box>
    </>
  )
}
