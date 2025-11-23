import { ApiDevelopment } from '@/@types/api-development'
import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { ControlledInputNumber } from '@/components/controlled-input/controlled-input-number'
import { ControlledInputDate } from '@/components/controlled-input/date'
import { ControlledSelect } from '@/components/controlled-select/controlled-select'
import { ControlledSelectAsync } from '@/components/controlled-select/controlled-select-async'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/layout/page-header'
import { useCepAutoFill } from '@/hooks/use-cep-auto-fill'
import { DevelopmentForm, schemaDevelopment } from '@/schemas/development'
import { addDevelopment, deleteDevelopment, updateDevelopment } from '@/services/development'
import { fetchLeisure } from '@/services/leisure'
import { fetchRealEstateDeveloper } from '@/services/real-estate-developer'
import { formatDateLong } from '@/utils/date-converter'
import { DEVELOPMENT_PHASE_OPTIONS } from '@/utils/development-phase'
import { STATUS_OPTIONS } from '@/utils/status'
import {
  Button,
  Card,
  Grid,
  GridItem,
  Group,
  Heading,
  HStack,
  IconButton,
  Separator,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { DefaultValues, useFieldArray, useForm } from 'react-hook-form'
import { BiTrashAlt } from 'react-icons/bi'
import { withMask } from 'use-mask-input'
import NextLink from 'next/link'
import { ControlledDeleteButton } from '@/components/dialog/controled/controlled-delete'

type Props = {
  mode: 'create' | 'edit'
  initial?: Partial<ApiDevelopment>
}

const toDefaultValues = (rel?: Partial<ApiDevelopment>): DefaultValues<DevelopmentForm> => {
  return {
    status: rel?.status === false ? 'inactive' : 'active',
    realEstateDeveloper:
      rel?.realEstateDeveloper && rel.realEstateDeveloper.length > 0
        ? rel.realEstateDeveloper.map((real) => ({
            value: real.id,
            label: real.name
          }))
        : [],
    name: rel?.name ?? '',
    phase: rel?.phase,
    releaseDate:
      rel?.releaseDate && rel?.releaseDate !== '0001-01-01' ? new Date(rel?.releaseDate + 'T12:00:00') : null,

    technicalSpecifications: {
      floorPlan: rel?.technicalSpecifications?.floorPlan ?? '',
      leisure: rel?.technicalSpecifications?.leisure
        ? rel?.technicalSpecifications?.leisure.map((leisure) => ({
            value: leisure.id,
            label: leisure.name
          }))
        : []
    },
    projectTeam: {
      architecture: rel?.projectTeam?.architecture ?? '',
      interiorDesign: rel?.projectTeam?.interiorDesign ?? '',
      landscaping: rel?.projectTeam?.landscaping ?? ''
    },

    distance:
      rel?.distance && rel.distance.length > 0
        ? rel.distance.map((distance) => ({
            distance: distance
          }))
        : [],

    typology: {
      studio: { quantity: rel?.typology?.studio?.quantity ?? 0, floorPlan: rel?.typology?.studio?.floorPlan ?? '' },
      one_bedroom: {
        quantity: rel?.typology?.one_bedroom?.quantity ?? 0,
        floorPlan: rel?.typology?.one_bedroom?.floorPlan ?? ''
      },
      two_bedroom: {
        quantity: rel?.typology?.two_bedroom?.quantity ?? 0,
        floorPlan: rel?.typology?.two_bedroom?.floorPlan ?? ''
      },
      three_bedroom: {
        quantity: rel?.typology?.three_bedroom?.quantity ?? 0,
        floorPlan: rel?.typology?.three_bedroom?.floorPlan ?? ''
      },
      four_bedroom: {
        quantity: rel?.typology?.four_bedroom?.quantity ?? 0,
        floorPlan: rel?.typology?.four_bedroom?.floorPlan ?? ''
      }
    },

    address: {
      postalCode: rel?.address?.postalCode?.replace(/\D/g, ''),
      street: rel?.address?.street,
      streetNumber: rel?.address?.streetNumber,
      neighborhood: rel?.address?.neighborhood,
      city: rel?.address?.city,
      state: rel?.address?.state
    }
  }
}

export function ModuleNewEditDevelopment({ mode, initial }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setValue
  } = useForm<DevelopmentForm>({
    resolver: zodResolver(schemaDevelopment),
    defaultValues: toDefaultValues(initial)
  })
  const router = useRouter()

  const hasInitialAddress =
    !!initial?.address &&
    !!(
      initial.address.postalCode ||
      initial.address.street ||
      initial.address.streetNumber ||
      initial.address.neighborhood ||
      initial.address.city ||
      initial.address.state
    )

  const { cepLoading, addressLocked } = useCepAutoFill<DevelopmentForm>({
    watch,
    setValue,
    hasInitialAddress,
    fields: {
      postalCode: 'address.postalCode',
      street: 'address.street',
      neighborhood: 'address.neighborhood',
      city: 'address.city',
      state: 'address.state',
      streetNumber: 'address.streetNumber',
      addressLine: 'address.addressLine'
    }
  })

  const onSubmit = async (payload: DevelopmentForm) => {
    let res

    if (mode === 'create') {
      res = await addDevelopment(payload)
    } else if (mode === 'edit' && initial?.id) {
      res = await updateDevelopment(initial.id, payload)
    }

    if (!res) return
    if (!res.success) return

    router.push('/developments/development')
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'distance'
  })

  return (
    <>
      <PageHeader
        title={mode == 'edit' ? `ID do projeto: ${initial?.token}` : 'Novo projeto'}
        subtitle={formatDateLong(initial?.logs?.inclusion?.date)}
        backButton
        backButtonLink="/developments/development"
        rightSlot={
          mode == 'edit' ? (
            <ControlledDeleteButton
              data={initial}
              entity="projeto"
              itemName={initial?.name}
              onDelete={async (data) => {
                const res = await deleteDevelopment(data?.id ?? '')

                if (!res.success) {
                  throw new Error()
                }
              }}
              renderTrigger={(open, loading) => (
                <Button onClick={open} colorPalette="red" loading={loading}>
                  Excluir projeto
                </Button>
              )}
              redirectTo="/developments/development"
              navigate={(to) => router.push(to)}
            />
          ) : null
        }
      />

      <Form hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit} gap={6}>
        <Stack w="full" gap={4} align="top" direction={{ base: 'column', xl: 'row' }}>
          <Stack gap={4} w="full">
            <Card.Root>
              <Card.Body>
                <Heading size="md" fontWeight="medium">
                  Informações do projeto
                </Heading>

                <Stack gap={4} mt={4}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <ControlledSelect
                      name="status"
                      control={control}
                      label="Status"
                      error={errors.status?.message}
                      items={STATUS_OPTIONS}
                    />
                    <ControlledSelectAsync
                      label="Incorporadora"
                      name="realEstateDeveloper"
                      control={control}
                      required
                      multiple
                      error={errors.realEstateDeveloper?.message}
                      loadOptions={async () => {
                        const res = await fetchRealEstateDeveloper({})
                        if (res.success && res.data) {
                          return res.data.records.map((c) => ({
                            label: c.name,
                            value: c.id,
                            isDisabled: !c.status
                          }))
                        }
                        return []
                      }}
                    />
                  </Grid>
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <ControlledInput
                      required
                      name="name"
                      control={control}
                      label="Nome do projeto"
                      error={errors.name?.message}
                    />
                  </GridItem>

                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <ControlledSelect
                      name="phase"
                      control={control}
                      required
                      label="Fase"
                      error={errors.phase?.message}
                      items={DEVELOPMENT_PHASE_OPTIONS}
                    />
                    <ControlledInputDate
                      name="releaseDate"
                      control={control}
                      label="Data de entrega"
                      placeholder="MMMM/AAAA"
                      format="MMMM/YYYY"
                      onlyMonthPicker
                      error={errors.releaseDate?.message}
                    />
                  </Grid>
                </Stack>
              </Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body>
                <Heading size="md" fontWeight="medium">
                  Endereço
                </Heading>

                <Stack gap={4} mt={4}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <ControlledInput
                      name="address.postalCode"
                      control={control}
                      label="CEP"
                      required
                      error={errors.address?.postalCode?.message}
                      ref={withMask(['99999-999'])}
                      placeholder="Ex.: 05410001"
                    />
                    {cepLoading && <Spinner mt={9} size="sm" />}
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <ControlledInput
                        name="address.street"
                        control={control}
                        label="Rua / Avenida"
                        required
                        error={errors.address?.street?.message}
                        placeholder="Ex.: Avenida los Leones"
                        disabled={addressLocked}
                      />
                      <ControlledInput
                        name="address.streetNumber"
                        control={control}
                        label="Número"
                        error={errors.address?.streetNumber?.message}
                        placeholder="Ex.: 4563"
                        disabled={addressLocked}
                      />
                    </GridItem>

                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <ControlledInput
                        name="address.addressLine"
                        control={control}
                        label="Complemento"
                        error={errors.address?.addressLine?.message}
                        placeholder="Ex.: Casa 3"
                        disabled={addressLocked}
                      />
                    </GridItem>
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <ControlledInput
                        name="address.neighborhood"
                        control={control}
                        label="Bairro"
                        required
                        error={errors.address?.neighborhood?.message}
                        disabled={addressLocked}
                      />
                      <ControlledInput
                        name="address.city"
                        control={control}
                        label="Cidade"
                        required
                        error={errors.address?.city?.message}
                        disabled={addressLocked}
                      />
                      <ControlledInput
                        name="address.state"
                        control={control}
                        label="Estado"
                        required
                        error={errors.address?.state?.message}
                        disabled={addressLocked}
                      />
                    </GridItem>
                  </Grid>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Stack>
          <Stack gap={4} w={{ base: 'full', xl: '7/12' }}>
            <Card.Root>
              <Card.Body>
                <Heading size="md" fontWeight="medium">
                  Ficha técnica
                </Heading>

                <Stack gap={4} mt={4}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <ControlledInput
                      name="technicalSpecifications.floorPlan"
                      control={control}
                      label="Área do terreno"
                      error={errors.technicalSpecifications?.floorPlan?.message}
                      endElement="m²"
                    />
                    <ControlledSelect
                      name="status"
                      control={control}
                      label="Status"
                      error={errors.status?.message}
                      items={STATUS_OPTIONS}
                    />
                  </Grid>
                  <ControlledSelectAsync
                    label="Lazer"
                    name="technicalSpecifications.leisure"
                    control={control}
                    multiple
                    isFilter
                    error={errors.technicalSpecifications?.leisure?.message}
                    loadOptions={async (_input, searchTxt = '', selected) => {
                      // 1) excluir os já selecionados
                      const excludeSelected =
                        selected?.map((s) => ({
                          field: 'id',
                          op: 'ne' as const,
                          value: s.value
                        })) ?? []

                      // 2) se o usuário digitou algo, montar o lk no name
                      const searchConds =
                        searchTxt.trim().length > 0
                          ? [
                              {
                                field: 'name',
                                op: 'lk' as const,
                                value: searchTxt.trim()
                              }
                            ]
                          : []

                      const fixedConds = [...excludeSelected, ...searchConds]

                      const res = await fetchLeisure({
                        fixedConds
                      })

                      if (res.success && res.data) {
                        return res.data.records.map((c) => ({
                          label: c.name,
                          value: c.id,
                          isDisabled: !c.status
                        }))
                      }
                      return []
                    }}
                  />
                </Stack>
              </Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body>
                <Heading size="md" fontWeight="medium">
                  Distâncias
                </Heading>

                <Stack gap={4} mt={4}>
                  {fields.map((field, index) => (
                    <Grid
                      key={field.id}
                      templateColumns={{ base: '1fr', md: '1fr auto' }}
                      gap={3}
                      alignItems="flex-end"
                    >
                      <ControlledInput
                        name={`distance.${index}.distance` as const}
                        control={control}
                        placeholder="Ex.: 650m da Estação Praça da Árvore"
                        label={`Localização ${fields.length === 1 ? '' : ` ${index + 1}`}`}
                        error={errors.projectTeam?.architecture?.message}
                      />
                      <GridItem>
                        <IconButton
                          aria-label="Excluir distância"
                          colorPalette="red"
                          variant="outline"
                          onClick={() => remove(index)}
                        >
                          <BiTrashAlt />
                        </IconButton>
                      </GridItem>
                    </Grid>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      append({ distance: '' })
                    }}
                  >
                    Adicionar distância
                  </Button>
                </Stack>
              </Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body>
                <Heading size="md" fontWeight="medium">
                  Tipologias
                </Heading>

                <Stack gap={10} mt={4}>
                  <Stack>
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <Separator flex="1" />
                      <Text flexShrink="0" fontSize="sm">
                        Studio
                      </Text>
                      <Separator flex="1" />
                    </GridItem>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
                      <ControlledInputNumber
                        name="typology.studio.quantity"
                        label="Quantidade"
                        control={control}
                        min={0}
                        controlChevron
                        error={errors.typology?.studio?.quantity?.message}
                      />

                      <ControlledInput
                        name="typology.studio.floorPlan"
                        control={control}
                        label="Planta"
                        error={errors.typology?.studio?.floorPlan?.message}
                        endElement="m²"
                      />
                    </Grid>
                  </Stack>
                  <Stack>
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <Separator flex="1" />
                      <Text flexShrink="0" fontSize="sm">
                        1 Dormitório
                      </Text>
                      <Separator flex="1" />
                    </GridItem>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
                      <ControlledInputNumber
                        name="typology.one_bedroom.quantity"
                        label="Quantidade"
                        control={control}
                        min={0}
                        controlChevron
                        error={errors.typology?.one_bedroom?.quantity?.message}
                      />

                      <ControlledInput
                        name="typology.one_bedroom.floorPlan"
                        control={control}
                        label="Planta"
                        error={errors.typology?.one_bedroom?.floorPlan?.message}
                        endElement="m²"
                      />
                    </Grid>
                  </Stack>
                  <Stack>
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <Separator flex="1" />
                      <Text flexShrink="0" fontSize="sm">
                        2 Dormitórios
                      </Text>
                      <Separator flex="1" />
                    </GridItem>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
                      <ControlledInputNumber
                        name="typology.two_bedroom.quantity"
                        label="Quantidade"
                        control={control}
                        min={0}
                        controlChevron
                        error={errors.typology?.two_bedroom?.quantity?.message}
                      />

                      <ControlledInput
                        name="typology.two_bedroom.floorPlan"
                        control={control}
                        label="Planta"
                        error={errors.typology?.two_bedroom?.floorPlan?.message}
                        endElement="m²"
                      />
                    </Grid>
                  </Stack>
                  <Stack>
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <Separator flex="1" />
                      <Text flexShrink="0" fontSize="sm">
                        3 Dormitórios
                      </Text>
                      <Separator flex="1" />
                    </GridItem>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
                      <ControlledInputNumber
                        name="typology.three_bedroom.quantity"
                        label="Quantidade"
                        control={control}
                        min={0}
                        controlChevron
                        error={errors.typology?.three_bedroom?.quantity?.message}
                      />

                      <ControlledInput
                        name="typology.three_bedroom.floorPlan"
                        control={control}
                        label="Planta"
                        error={errors.typology?.three_bedroom?.floorPlan?.message}
                        endElement="m²"
                      />
                    </Grid>
                  </Stack>
                  <Stack>
                    <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                      <Separator flex="1" />
                      <Text flexShrink="0" fontSize="sm">
                        4 Dormitórios
                      </Text>
                      <Separator flex="1" />
                    </GridItem>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} alignItems="center">
                      <ControlledInputNumber
                        name="typology.four_bedroom.quantity"
                        label="Quantidade"
                        control={control}
                        min={0}
                        controlChevron
                        error={errors.typology?.four_bedroom?.quantity?.message}
                      />

                      <ControlledInput
                        name="typology.four_bedroom.floorPlan"
                        control={control}
                        label="Planta"
                        error={errors.typology?.four_bedroom?.floorPlan?.message}
                        endElement="m²"
                      />
                    </Grid>
                  </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body>
                <Heading size="md" fontWeight="medium">
                  Responsáveis
                </Heading>

                <Stack gap={4} mt={4}>
                  <ControlledInput
                    name="projectTeam.architecture"
                    control={control}
                    label="Projeto de arquitetura"
                    error={errors.projectTeam?.architecture?.message}
                  />
                  <ControlledInput
                    name="projectTeam.interiorDesign"
                    control={control}
                    label="Projeto de decoração"
                    error={errors.projectTeam?.interiorDesign?.message}
                  />
                  <ControlledInput
                    name="projectTeam.landscaping"
                    control={control}
                    label="Projeto de paisagismo"
                    error={errors.projectTeam?.landscaping?.message}
                  />
                </Stack>
              </Card.Body>
            </Card.Root>
          </Stack>
        </Stack>
        <Separator flex="1" />
        <HStack justify="end">
          <Group>
            <NextLink href="/developments/development">
              <Button variant="ghost" disabled={isSubmitting}>
                Cancelar
              </Button>
            </NextLink>
            <Button type="submit" loading={isSubmitting}>
              {mode === 'create' ? 'Salvar' : 'Atualizar'} projeto
            </Button>
          </Group>
        </HStack>
      </Form>
    </>
  )
}
