import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { schemaRequestReset, type RequestResetForm } from '@/schemas/password'
import { Box, Button, Card, Heading, Input, Alert, Field, Fieldset, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Form } from '@/components/form'
import { Seo } from '@/components/seo'
import { withGuestGSSP } from '@/server/guest-ssr'

export const getServerSideProps = withGuestGSSP()()

export default function ForgotPasswordPage() {
  const [apiMsg, setApiMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RequestResetForm>({ resolver: zodResolver(schemaRequestReset), defaultValues: { identifier: '' } })

  const onSubmit = async ({ identifier }: RequestResetForm) => {
    setApiMsg(null)
    try {
      const { data } = await api.post<{ email: string }>('/Authentication/request-password-reset', { identifier })
      setApiMsg(`Enviamos um e-mail para: ${data.email}. Verifique sua caixa de entrada.`)
    } catch (err) {
      setApiMsg(getApiErrorMessage(err) ?? 'Não foi possível solicitar a redefinição.')
    }
  }

  return (
    <Box minH="100dvh" display="grid" placeItems="center" p="6">
      <Seo title="Esqueceu sua senha" noIndex />
      <Card.Root w="full" maxW="sm">
        <Card.Body>
          <Form<RequestResetForm> w="full" maxW="md" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
            <Heading size="lg" textAlign="center">
              Esqueci minha senha
            </Heading>

            {apiMsg && (
              <Alert.Root status="info" borderRadius="md">
                <Alert.Indicator />
                {apiMsg}
              </Alert.Root>
            )}

            <Fieldset.Root>
              <Field.Root invalid={!!errors.identifier}>
                <Field.Label>Usuário ou e-mail</Field.Label>
                <Input {...register('identifier')} placeholder="seu.usuario ou email@dominio.com" autoFocus />
                <Field.ErrorText>{errors.identifier?.message}</Field.ErrorText>
              </Field.Root>
            </Fieldset.Root>

            <Button type="submit" colorPalette="teal" loading={isSubmitting} disabled={isSubmitting}>
              Enviar instruções
            </Button>

            <Text mt="3" fontSize="sm">
              Já tem token?{' '}
              <Link asChild colorPalette="teal">
                <NextLink href="/reset-password">Redefinir senha</NextLink>
              </Link>
            </Text>
          </Form>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}
