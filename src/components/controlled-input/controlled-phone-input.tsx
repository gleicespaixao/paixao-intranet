import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form'
import { Field, InputGroup, NativeSelect } from '@chakra-ui/react'
import { Input as CInput } from '@chakra-ui/react'
import { DIAL_CODE_OPTIONS, getMaskForDialCode } from '@/utils/phone-ddi-config'
import { withMask } from 'use-mask-input'

function applyMask(value: string, mask: string): string {
  if (!mask) return value

  const digits = value.replace(/\D/g, '')
  if (!digits) return ''

  let result = ''
  let maskIndex = 0

  // Para cada dígito digitado, encontramos a próxima posição '9' na máscara
  for (let d = 0; d < digits.length; d++) {
    const digit = digits[d]

    // acha o próximo '9' na máscara a partir de maskIndex
    const nextNineIndex = mask.indexOf('9', maskIndex)
    if (nextNineIndex === -1) {
      // não tem mais posição pra dígito na máscara
      break
    }

    // adiciona tudo que está entre maskIndex e a posição do '9' (caracteres fixos)
    result += mask.slice(maskIndex, nextNineIndex)

    // adiciona o dígito na posição do '9'
    result += digit

    // atualiza o índice da máscara para depois desse '9'
    maskIndex = nextNineIndex + 1
  }

  return result
}

// helper: dado todos os dígitos, tenta separar DDI + local
function splitPhoneDigits(allDigits: string) {
  const fallbackDialCode = '+55'
  const fallbackDialDigits = fallbackDialCode.replace(/\D/g, '')

  if (!allDigits) {
    return {
      dialCode: fallbackDialCode,
      dialDigits: fallbackDialDigits,
      localDigits: ''
    }
  }

  const optionsWithDigits = DIAL_CODE_OPTIONS.map((opt) => ({
    code: opt.value,
    digits: opt.value.replace(/\D/g, '')
  })).sort((a, b) => b.digits.length - a.digits.length) // tenta primeiro os DDIs mais longos

  for (const opt of optionsWithDigits) {
    if (allDigits.startsWith(opt.digits) && allDigits.length > opt.digits.length) {
      return {
        dialCode: opt.code,
        dialDigits: opt.digits,
        localDigits: allDigits.slice(opt.digits.length)
      }
    }
  }

  // Se não bateu com nenhum DDI conhecido:
  // - se tiver até 11 dígitos, assume BR (caso legado sem DDI)
  if (allDigits.length <= 11) {
    return {
      dialCode: fallbackDialCode,
      dialDigits: fallbackDialDigits,
      localDigits: allDigits
    }
  }

  // fallback: joga tudo como local com DDI padrão
  return {
    dialCode: fallbackDialCode,
    dialDigits: fallbackDialDigits,
    localDigits: allDigits
  }
}

type ControlledPhoneProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  /** Nome do campo único (ex.: "phone") */
  name: FieldPath<TFieldValues>
  label?: string
  error?: string
  invalid?: boolean
  required?: boolean
  disabled?: boolean
}

export function ControlledPhone<TFieldValues extends FieldValues>({
  control,
  name,
  label = 'Telefone',
  error,
  invalid,
  required,
  disabled
}: ControlledPhoneProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const rawValue = field.value ?? ''
        const allDigits = String(rawValue).replace(/\D/g, '')

        const { dialCode, localDigits } = splitPhoneDigits(allDigits)
        const currentMask = getMaskForDialCode(dialCode)
        const maskedLocal = applyMask(localDigits, currentMask)

        const buildCanonical = (dial: string, local: string) => {
          const dialOnlyDigits = dial.replace(/\D/g, '')
          const localOnlyDigits = local.replace(/\D/g, '')

          // se não tem número local, consideramos "sem telefone"
          if (!localOnlyDigits) return ''

          // canonical: E.164 → +DDINNNNNNNN
          return `+${dialOnlyDigits}${localOnlyDigits}`
        }

        const handleDialChange = (newDialCode: string) => {
          // se não tem nada digitado no número local, não salva só o DDI
          if (!maskedLocal.replace(/\D/g, '')) {
            field.onChange('')
            return
          }

          const canonical = buildCanonical(newDialCode, maskedLocal)
          field.onChange(canonical)
        }

        const handleLocalChange = (input: string) => {
          const masked = applyMask(input, currentMask)
          const canonical = buildCanonical(dialCode, masked)
          field.onChange(canonical)
        }

        // não queremos que o CInput use o value/onChange "original" do RHF
        // porque estamos controlando isso manualmente
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onChange: _ignoreOnChange, value: _ignoreValue, ...restField } = field

        return (
          <Field.Root required={required} invalid={Boolean(error) || Boolean(invalid)}>
            {label ? (
              <Field.Label>
                {label}
                {required && <Field.RequiredIndicator />}
              </Field.Label>
            ) : null}

            <InputGroup
              w="full"
              startAddon={
                <NativeSelect.Root size="xs" variant="plain" disabled={disabled}>
                  <NativeSelect.Field
                    value={dialCode}
                    fontSize="sm"
                    onChange={(e) => handleDialChange(e.currentTarget.value)}
                  >
                    {DIAL_CODE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              }
            >
              <CInput
                {...restField}
                disabled={disabled}
                inputMode="tel"
                value={maskedLocal}
                placeholder={currentMask}
                ref={withMask(currentMask)}
                onChange={(e) => handleLocalChange(e.target.value)}
              />
            </InputGroup>

            {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
          </Field.Root>
        )
      }}
    />
  )
}
