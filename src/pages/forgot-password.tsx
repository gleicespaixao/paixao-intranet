import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaRequestReset, type RequestResetForm } from '@/schemas/password'
import { Box, Button, Card, Heading, Alert, Fieldset, Text, Link, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Form } from '@/components/form'
import { Seo } from '@/components/seo'
import { withGuestGSSP } from '@/server/guest-ssr'
import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { Logotipo } from '@/components/logotipo'
import { requestPasswordReset } from '@/services/authentication'

export const getServerSideProps = withGuestGSSP()()

export default function ForgotPasswordPage() {
  const [apiMsg, setApiMsg] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RequestResetForm>({
    resolver: zodResolver(schemaRequestReset),
    defaultValues: { identifier: '' }
  })

  const onSubmit = async ({ identifier }: RequestResetForm) => {
    setApiMsg(null)
    const res = await requestPasswordReset({ identifier })
    if (res.success) {
      setApiMsg(`Enviamos um e-mail para: ${res.data.email}. Verifique sua caixa de entrada.`)
      reset({ identifier })
    } else {
      setApiMsg(res.error || 'Não foi possível solicitar a redefinição.')
    }
  }

  return (
    <>
      <Seo title="Esqueci minha senha" noIndex />
      <Box minH="100dvh" display="grid" placeItems="center" p="6">
        <Card.Root w="full" maxW="md">
          <Card.Body>
            <Form<RequestResetForm> w="full" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
              <Stack gap={4}>
                <Stack align="center" gap="4" mb="6">
                  <Logotipo />
                  <Heading size="2xl" textAlign="center">
                    Recuperar acesso ao SisPa
                  </Heading>
                  <Text color="fg.muted" textAlign="center">
                    Informe seu usuário ou e-mail para receber o link de redefinição
                  </Text>
                </Stack>

                {apiMsg && (
                  <Alert.Root status="info" borderRadius="md" mb="3">
                    <Alert.Indicator />
                    {apiMsg}
                  </Alert.Root>
                )}

                <Fieldset.Root gap="2">
                  <ControlledInput<RequestResetForm>
                    name="identifier"
                    control={control}
                    label="Usuário ou e-mail"
                    placeholder=""
                    error={errors.identifier?.message}
                    autoFocus
                  />
                </Fieldset.Root>

                <Button
                  mt="4"
                  type="submit"
                  colorPalette="teal"
                  w="full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Enviar instruções
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
