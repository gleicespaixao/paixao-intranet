import { ApiDevelopment } from '@/@types/api-development'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/layout/page-header'
import { DevelopmentForm, schemaDevelopment } from '@/schemas/development'
import { addDevelopment, deleteDevelopment, updateDevelopment } from '@/services/development'
import { formatDateLong } from '@/utils/date-converter'
import { Button, Group, HStack, Separator, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { DefaultValues, useForm } from 'react-hook-form'
import NextLink from 'next/link'
import { ControlledDeleteButton } from '@/components/dialog/controled/controlled-delete'
import { DevelopmentViewInfo } from './info'
import { DevelopmentViewAddress } from './address'
import { DevelopmentViewTechnicalSpecifications } from './technical-specifications'
import { DevelopmentViewDistances } from './distances'
import { DevelopmentViewTypologies } from './typologies'
import { DevelopmentViewProjectTeam } from './project-team'
import { DevelopmentViewImages } from './images'
import { DevelopmentViewFloorPlan } from './floor-plan'

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
      unitType: rel?.technicalSpecifications?.unitType
        ? rel?.technicalSpecifications?.unitType.map((unitType) => ({
            value: unitType.id,
            label: unitType.name
          }))
        : [],
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

export function ModuleDevelopmentView({ mode, initial }: Props) {
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
            <DevelopmentViewInfo control={control} errors={errors} />
            <DevelopmentViewAddress
              watch={watch}
              setValue={setValue}
              hasInitialAddress={hasInitialAddress}
              control={control}
              errors={errors}
            />
            <DevelopmentViewImages development={initial} disabled={mode == 'create'} />
            <DevelopmentViewFloorPlan development={initial} disabled={mode == 'create'} />
          </Stack>
          <Stack gap={4} w={{ base: 'full', xl: '7/12' }}>
            <DevelopmentViewTechnicalSpecifications control={control} errors={errors} />
            <DevelopmentViewDistances control={control} errors={errors} />
            <DevelopmentViewTypologies control={control} errors={errors} />
            <DevelopmentViewProjectTeam control={control} errors={errors} />
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
