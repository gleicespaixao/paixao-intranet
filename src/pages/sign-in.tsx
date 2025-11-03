// src/pages/sign-in.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Box, Button, Card, Heading, Text, Alert, Link, Fieldset, Flex, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Form } from '@/components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginForm, schemaLogin } from '@/schemas/login'
import { withGuestGSSP } from '@/server/guest-ssr'
import { Seo } from '@/components/seo'
import { ControlledInput } from '@/components/controlled-input'
import { ControlledPasswordInput } from '@/components/controlled-password-input'
import { Logotipo } from '@/components/logotipo'

export const getServerSideProps = withGuestGSSP()()

export default function SignInPage() {
  const router = useRouter()
  const [errorMsg, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(schemaLogin),
    defaultValues: { identifier: '', password: '' }
  })

  const onSubmit = async ({ identifier, password }: LoginForm) => {
    setError(null)
    const res = await signIn('credentials', { redirect: false, identifier, password })
    if (!res) return setError('Unexpected failure. Try again.')
    if (!res.ok) return setError(res.error ?? 'Invalid credentials.')

    const callbackUrl = (router.query.callbackUrl as string) ?? '/dashboard'
    await router.replace(callbackUrl)
  }

  return (
    <>
      <Seo title="Login" noIndex />
      <Box minH="100dvh" display="grid" placeItems="center">
        <Card.Root w="full" maxW="md">
          <Card.Body>
            <Form w="full" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
              <Stack gap={4}>
                <Stack align="center" gap="4" mb="6">
                  <Logotipo />
                  <Heading size="2xl" textAlign="center">
                    Faça login no SisPa
                  </Heading>
                  <Text color="fg.muted" textAlign="center">
                    Gestão de projetos imobiliários e clientes
                  </Text>
                </Stack>

                {errorMsg && (
                  <Alert.Root status="error" borderRadius="md" mb="3">
                    <Alert.Indicator />
                    {errorMsg}
                  </Alert.Root>
                )}

                <Fieldset.Root gap="2">
                  <ControlledInput<LoginForm>
                    name="identifier"
                    control={control}
                    label="Usuário ou e-mail"
                    placeholder=""
                    error={errors.identifier?.message}
                    autoFocus
                  />

                  <ControlledPasswordInput<LoginForm>
                    name="password"
                    control={control}
                    label="Senha"
                    error={errors.password?.message}
                  />
                </Fieldset.Root>

                {/* remember + forgot */}
                <Flex align="center" justify="end" fontSize="sm" mt="2" mb="4">
                  <Link asChild colorPalette="teal">
                    <NextLink href="/forgot-password">Esqueci minha senha</NextLink>
                  </Link>
                </Flex>

                {/* botão full width */}
                <Button type="submit" colorPalette="teal" w="full" loading={isSubmitting} disabled={isSubmitting}>
                  Entrar
                </Button>
              </Stack>
            </Form>
          </Card.Body>
        </Card.Root>
      </Box>
    </>
  )
}
