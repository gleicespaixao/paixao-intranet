import * as React from 'react'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import type { CustomerForm } from '@/schemas/customer'
import { fetchCepAddress } from '@/services/cep'
import { toaster } from '@/components/ui/toaster'

type Params = {
  watch: UseFormWatch<CustomerForm>
  setValue: UseFormSetValue<CustomerForm>
  hasInitialAddress?: boolean
}

export function useCustomerCepAutoFill({ watch, setValue, hasInitialAddress }: Params) {
  const [cepLoading, setCepLoading] = React.useState(false)
  const [addressLocked, setAddressLocked] = React.useState<boolean>(() => !hasInitialAddress)

  // guarda o último CEP (8 dígitos) que já foi buscado
  const lastCepSearchedRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    setAddressLocked(!hasInitialAddress)
  }, [hasInitialAddress])

  React.useEffect(() => {
    const subscription = watch(async (value, { name }) => {
      if (name !== 'address.postalCode') return

      const rawCep = value.address?.postalCode || ''
      const digits = rawCep.replace(/\D/g, '')

      // 🧹 CEP apagado ou incompleto → limpar e bloquear endereço, e esquecer CEP anterior
      if (digits.length < 8) {
        lastCepSearchedRef.current = null

        setValue('address.street', '')
        setValue('address.neighborhood', '')
        setValue('address.city', '')
        setValue('address.state', '')
        setValue('address.streetNumber', '')
        setValue('address.addressLine', '')
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

        // só seta o CEP se for diferente do que está no campo (evita trigger desnecessário)
        if (value.address?.postalCode?.replace(/\D/g, '') !== addr.postalCode) {
          setValue('address.postalCode', addr.postalCode)
        }

        setValue('address.street', addr.street ?? '')
        setValue('address.neighborhood', addr.neighborhood ?? '')
        setValue('address.city', addr.city ?? '')
        setValue('address.state', addr.state ?? '')
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
  }, [watch, setValue])

  return { cepLoading, addressLocked }
}
