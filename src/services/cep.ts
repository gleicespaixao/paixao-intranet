export type CepAddress = {
  postalCode: string
  street?: string
  neighborhood?: string
  city?: string
  state?: string
}

// implementação usando ViaCEP (pode trocar por sua API depois)
export async function fetchCepAddress(rawCep: string): Promise<CepAddress> {
  const digits = rawCep.replace(/\D/g, '')

  if (digits.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos')
  }

  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)

  if (!res.ok) {
    throw new Error('Erro ao buscar CEP')
  }

  const data = await res.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return {
    postalCode: digits,
    street: data.logradouro || '',
    neighborhood: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || ''
  }
}
