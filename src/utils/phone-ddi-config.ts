export type DialCodeOption = {
  value: string // ex: '+55'
  label: string // ex: '🇧🇷 +55'
  mask: string // máscara da parte local, usando '9' para dígitos
}

export const DIAL_CODE_OPTIONS: DialCodeOption[] = [
  // 🇧🇷 Brasil
  {
    value: '+55',
    label: '🇧🇷 +55',
    mask: '(99) 99999-9999'
  },

  // 🇺🇸 Estados Unidos
  {
    value: '+1',
    label: '🇺🇸 +1',
    mask: '(999) 999-9999'
  },

  // 🇬🇧 Reino Unido
  {
    value: '+44',
    label: '🇬🇧 +44',
    mask: '9999 999 999'
  },

  // 🇵🇹 Portugal
  {
    value: '+351',
    label: '🇵🇹 +351',
    mask: '99 999 9999'
  },

  // 🇪🇸 Espanha
  {
    value: '+34',
    label: '🇪🇸 +34',
    mask: '999 999 999'
  },

  // 🇫🇷 França
  {
    value: '+33',
    label: '🇫🇷 +33',
    mask: '9 99 99 99 99'
  },

  // 🇮🇹 Itália
  {
    value: '+39',
    label: '🇮🇹 +39',
    mask: '99 9999 9999'
  },

  // 🇩🇪 Alemanha
  {
    value: '+49',
    label: '🇩🇪 +49',
    mask: '9999 999999'
  },

  // 🌏 Oceania
  {
    value: '+61',
    label: '🇦🇺 +61',
    mask: '9 9999 9999'
  },
  {
    value: '+64',
    label: '🇳🇿 +64',
    mask: '99 999 9999'
  },

  // 🇯🇵 Japão
  {
    value: '+81',
    label: '🇯🇵 +81',
    mask: '99 9999 9999'
  },

  // 🇨🇳 China
  {
    value: '+86',
    label: '🇨🇳 +86',
    mask: '99 9999 9999'
  },

  // 🌎 América Latina mais comum
  {
    value: '+52',
    label: '🇲🇽 +52',
    mask: '99 9999 9999'
  },
  {
    value: '+54',
    label: '🇦🇷 +54',
    mask: '99 9999 9999'
  },
  {
    value: '+57',
    label: '🇨🇴 +57',
    mask: '99 999 9999'
  },
  {
    value: '+56',
    label: '🇨🇱 +56',
    mask: '9 9999 9999'
  },
  {
    value: '+598',
    label: '🇺🇾 +598',
    mask: '9 999 9999'
  },

  // 🇮🇸 Islândia
  {
    value: '+354',
    label: '🇮🇸 +354',
    mask: '999 9999'
  },

  // 🇰🇼 Kuwait
  {
    value: '+965',
    label: '🇰🇼 +965',
    mask: '9999 9999'
  }
]

export const DIAL_CODE_MASK_MAP: Record<string, string> = DIAL_CODE_OPTIONS.reduce(
  (acc, item) => {
    acc[item.value] = item.mask
    return acc
  },
  {} as Record<string, string>
)

export function getMaskForDialCode(dialCode: string | undefined): string {
  if (!dialCode) return '(99) 99999-9999' // fallback
  return DIAL_CODE_MASK_MAP[dialCode] ?? '(99) 99999-9999'
}

// helper: aplica máscara usando '9' como placeholder
function applyMask(digits: string, mask: string): string {
  const onlyDigits = digits.replace(/\D/g, '')
  if (!onlyDigits) return ''

  let result = ''
  let maskIndex = 0

  for (let d = 0; d < onlyDigits.length; d++) {
    const digit = onlyDigits[d]

    const nextNineIndex = mask.indexOf('9', maskIndex)
    if (nextNineIndex === -1) break

    result += mask.slice(maskIndex, nextNineIndex)
    result += digit
    maskIndex = nextNineIndex + 1
  }

  return result
}

// helper: dado o telefone cru (E.164 ou só BR), descobre DDI + local
function splitPhoneDigitsForDisplay(phone: string) {
  const rawDigits = phone.replace(/\D/g, '')
  if (!rawDigits) {
    return {
      dialCode: '+55',
      localDigits: ''
    }
  }

  // tenta casar com os DDIs conhecidos (maior comprimento primeiro)
  const optionsWithDigits = DIAL_CODE_OPTIONS.map((opt) => ({
    code: opt.value,
    digits: opt.value.replace(/\D/g, '')
  })).sort((a, b) => b.digits.length - a.digits.length)

  for (const opt of optionsWithDigits) {
    if (rawDigits.startsWith(opt.digits) && rawDigits.length > opt.digits.length) {
      return {
        dialCode: opt.code,
        localDigits: rawDigits.slice(opt.digits.length)
      }
    }
  }

  // legado sem DDI → assume BR
  if (rawDigits.length <= 11) {
    return {
      dialCode: '+55',
      localDigits: rawDigits
    }
  }

  // fallback: assume BR mesmo assim
  return {
    dialCode: '+55',
    localDigits: rawDigits
  }
}

// 👉 Função que você vai usar na listagem
export function formatPhoneForList(phone?: string | null, withFlag: boolean = false): string {
  if (!phone) return ''

  const { dialCode, localDigits } = splitPhoneDigitsForDisplay(phone)
  const mask = getMaskForDialCode(dialCode)
  const maskedLocal = applyMask(localDigits, mask)

  if (!maskedLocal) return ''

  if (withFlag) {
    const opt = DIAL_CODE_OPTIONS.find((o) => o.value === dialCode)
    // ex.: "🇧🇷 +55 (11) 98888-7777"
    return `${opt?.label ?? dialCode} ${maskedLocal}`
  }

  // ex.: "+55 (11) 98888-7777"
  return `${dialCode} ${maskedLocal}`
}
