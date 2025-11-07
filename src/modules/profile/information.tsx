import { withMask } from 'use-mask-input'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Card, Grid, Heading, Stack, Text, Fieldset, Avatar, HStack, Alert } from '@chakra-ui/react'

import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { toaster } from '@/components/ui/toaster'
import { ControlledInputDate } from '@/components/controlled-input/date'
import { schemaUserSimple, UserSimpleForm } from '@/schemas/user'
import { updateUserSimple } from '@/services/user'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { Form } from '@/components/form'

export const ModuleProfileInformation = () => {
  const { data: session, update } = useSession()

  // PROFILE FORM
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UserSimpleForm>({
    resolver: zodResolver(schemaUserSimple),
    defaultValues: {
      name: session?.user?.name,
      surname: session?.user?.surname,
      email: session?.user?.email,
      dateBirth:
        session?.user?.dateBirth && session?.user?.dateBirth !== '0001-01-01'
          ? new Date(session?.user?.dateBirth + 'T12:00:00')
          : undefined,
      phone: formatPhoneNumber(session?.user?.phone)
    }
  })
  const [profileError, setProfileError] = React.useState<string | null>(null)

  const onSubmit = async (values: UserSimpleForm) => {
    setProfileError(null)
    const res = await updateUserSimple(values)
    if (!res.success) {
      setProfileError(res.error)
      return
    }
    const { dateBirth, phone } = res.data
    await update({
      user: {
        ...(session?.user ?? {}),
        ...res.data
      }
    })
    toaster.success({ title: 'Perfil atualizado' })
    reset({
      ...res.data,
      dateBirth: new Date(dateBirth + 'T12:00:00'),
      phone: formatPhoneNumber(phone)
    } as unknown as UserSimpleForm)
  }
  return (
    <Grid templateColumns={{ base: '1fr', lg: '240px 1fr' }} gap="10" alignItems="start" mb="12">
      {/* Lado esquerdo */}
      <Stack gap="1">
        <Heading size="md">Informações do perfil</Heading>
        <Text color="fg.muted">Altere as informações do perfil</Text>
      </Stack>

      {/* Lado direito */}
      <Card.Root>
        <Card.Body>
          <Form w="full" gap="4" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
            <HStack gap="4" justify="space-around">
              <Avatar.Root size="2xl">
                <Avatar.Fallback name={session?.user?.name} />
              </Avatar.Root>
            </HStack>

            {profileError && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                {profileError}
              </Alert.Root>
            )}

            <Fieldset.Root gap="3" mt="2">
              <ControlledInput<UserSimpleForm>
                name="name"
                control={control}
                label="Nome"
                error={errors.name?.message}
              />
            </Fieldset.Root>
            <Fieldset.Root gap="3" mt="2">
              <ControlledInput<UserSimpleForm>
                name="surname"
                control={control}
                label="Sobrenome"
                error={errors.surname?.message}
              />
            </Fieldset.Root>

            <Fieldset.Root gap="3">
              <ControlledInput<UserSimpleForm>
                name="email"
                control={control}
                label="E-mail"
                error={errors.email?.message}
              />
            </Fieldset.Root>
            <Fieldset.Root gap="3">
              <ControlledInputDate<UserSimpleForm>
                name="dateBirth"
                control={control}
                label="Data de nascimento"
                error={errors.dateBirth?.message}
              />
            </Fieldset.Root>
            <Fieldset.Root gap="3" mt="2">
              <ControlledInput<UserSimpleForm>
                startElement="BR +55"
                ps="16"
                name="phone"
                control={control}
                label="Telefone"
                error={errors.phone?.message}
                ref={withMask(['(99) 9999-9999', '(99) 99999-9999'])}
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
