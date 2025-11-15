import * as React from 'react'
import type { FieldValues, Path, PathValue, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { fetchCepAddress } from '@/services/cep'
import { toaster } from '@/components/ui/toaster'

type WithAddress = {
  address?: {
    postalCode?: string | null
    street?: string | null
    neighborhood?: string | null
    city?: string | null
    state?: string | null
    streetNumber?: string | null
    addressLine?: string | null
  }
}

type AddressFieldPaths = {
  postalCode: string
  street: string
  neighborhood: string
  city: string
  state: string
  streetNumber: string
  addressLine: string
}

type Params<TForm extends FieldValues & WithAddress> = {
  watch: UseFormWatch<TForm>
  setValue: UseFormSetValue<TForm>
  hasInitialAddress?: boolean
  fields: AddressFieldPaths
}

export function useCepAutoFill<TForm extends FieldValues & WithAddress>({
  watch,
  setValue,
  hasInitialAddress,
  fields
}: Params<TForm>) {
  const [cepLoading, setCepLoading] = React.useState(false)
  const [addressLocked, setAddressLocked] = React.useState<boolean>(() => !hasInitialAddress)

  // guarda o último CEP (8 dígitos) que já foi buscado
  const lastCepSearchedRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    setAddressLocked(!hasInitialAddress)
  }, [hasInitialAddress])

  React.useEffect(() => {
    const subscription = watch(async (value, { name }) => {
      const postalCodeField = fields.postalCode as Path<TForm>

      // só reage quando o campo de CEP mudar
      if (!name || name !== postalCodeField) return

      const rawCep = value.address?.postalCode ?? ''
      const digits = rawCep.replace(/\D/g, '')

      // 🧹 CEP apagado ou incompleto → limpar e bloquear endereço, e esquecer CEP anterior
      if (digits.length < 8) {
        lastCepSearchedRef.current = null

        const streetField = fields.street as Path<TForm>
        const neighborhoodField = fields.neighborhood as Path<TForm>
        const cityField = fields.city as Path<TForm>
        const stateField = fields.state as Path<TForm>
        const streetNumberField = fields.streetNumber as Path<TForm>
        const addressLineField = fields.addressLine as Path<TForm>

        setValue(streetField, '' as PathValue<TForm, typeof streetField>)
        setValue(neighborhoodField, '' as PathValue<TForm, typeof neighborhoodField>)
        setValue(cityField, '' as PathValue<TForm, typeof cityField>)
        setValue(stateField, '' as PathValue<TForm, typeof stateField>)
        setValue(streetNumberField, '' as PathValue<TForm, typeof streetNumberField>)
        setValue(addressLineField, '' as PathValue<TForm, typeof addressLineField>)

        setAddressLocked(true)
        return
      }

      // só reage quando tiver exatamente 8 dígitos
      if (digits.length !== 8) return

      // 🚫 se já buscamos esse CEP, não busca de novo (evita loop com setValue)
      if (lastCepSearchedRef.current === digits) return
      lastCepSearchedRef.current = digits

      try {
        setCepLoading(true)

        const addr = await fetchCepAddress(digits)

        const currentDigits = rawCep.replace(/\D/g, '')

        // só seta o CEP se for diferente do que está no campo (evita trigger desnecessário)
        if (addr.postalCode && currentDigits !== addr.postalCode) {
          setValue(postalCodeField, addr.postalCode as PathValue<TForm, typeof postalCodeField>)
        }

        const streetField = fields.street as Path<TForm>
        const neighborhoodField = fields.neighborhood as Path<TForm>
        const cityField = fields.city as Path<TForm>
        const stateField = fields.state as Path<TForm>

        if (addr.street) {
          setValue(streetField, addr.street as PathValue<TForm, typeof streetField>)
        }
        if (addr.neighborhood) {
          setValue(neighborhoodField, addr.neighborhood as PathValue<TForm, typeof neighborhoodField>)
        }
        if (addr.city) {
          setValue(cityField, addr.city as PathValue<TForm, typeof cityField>)
        }
        if (addr.state) {
          setValue(stateField, addr.state as PathValue<TForm, typeof stateField>)
        }
      } catch (error: unknown) {
        let message = 'Não foi possível buscar o CEP informado'
        if (error instanceof Error) {
          message = error.message
        }

        toaster.create({
          title: 'Erro ao buscar CEP',
          description: message,
          type: 'error'
        })
      } finally {
        setCepLoading(false)
        // ✅ depois de tentar (sucesso ou erro), libera os campos
        setAddressLocked(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue, fields])

  return { cepLoading, addressLocked }
}
