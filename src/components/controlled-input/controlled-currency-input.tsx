import { Input } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

import { Field, type InputProps as ChakraInputProps } from '@chakra-ui/react'
import { NumberFormatBase, NumberFormatValues } from 'react-number-format'

import { InputGroup } from '@/components/ui/input-group'

export type CustomInputProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  error?: string
  invalid?: boolean
  disabled?: boolean
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  decimalScale?: number
}

type PassThroughProps = Omit<ChakraInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'type'>

export type ControlledCurrencyInputProps<TFieldValues extends FieldValues> = PassThroughProps & {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  invalid?: boolean
  error?: string
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  decimalScale?: number
}

export function ControlledCurrencyInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  invalid,
  disabled,
  startElement,
  endElement,
  decimalScale = 2,
  ...rest
}: ControlledCurrencyInputProps<TFieldValues>) {
  const inputRef = useRef<HTMLInputElement>(null)

  const lockCursorToEnd = () => {
    const input = inputRef.current
    if (!input) return

    const len = input.value.length
    input.setSelectionRange(len, len)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const blockedKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End']
    if (blockedKeys.includes(e.key) || e.shiftKey || e.ctrlKey) {
      e.preventDefault()
    }

    // Permite backspace normalmente
    setTimeout(() => lockCursorToEnd(), 0)
  }

  const handleMouseDown = () => {
    // Deixa o foco acontecer, mas depois força o cursor ao final
    setTimeout(() => lockCursorToEnd(), 0)
  }

  const handleChange = () => {
    // Garante que ao apagar tudo o cursor continue no fim
    setTimeout(() => lockCursorToEnd(), 0)
  }

  // Função de formatação para exibir o valor como moeda brasileira
  const format = (numStr: string) => {
    if (numStr === '') return ''

    // Remove todos os caracteres não numéricos
    const numericStr = numStr.replace(/\D/g, '')

    // Converte o valor para o formato correto com centavos
    const num = parseFloat(numericStr) / Math.pow(10, decimalScale)

    if (isNaN(num)) return ''

    // Formata o valor como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: decimalScale,
      maximumFractionDigits: decimalScale
    }).format(num)
  }

  // Função para remover a formatação e obter o valor bruto (em centavos)
  const removeFormatting = (formattedValue: string) => {
    return formattedValue.replace(/\D/g, '')
  }

  return (
    <Controller<TFieldValues>
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <Field.Root required={rest.required} invalid={Boolean(error) || Boolean(invalid)}>
          {label ? (
            <Field.Label>
              {label}
              <Field.RequiredIndicator />
            </Field.Label>
          ) : null}

          <InputGroup w="full" startElement={startElement} endElement={endElement}>
            <NumberFormatBase
              {...field}
              value={value ? format(value.toString()) : 'R$ 0,00'}
              format={format}
              removeFormatting={removeFormatting}
              onValueChange={(values: NumberFormatValues) => {
                // Aqui estamos ajustando para que o valor seja tratado corretamente
                const numericStr = values.value.replace(/\D/g, '') // Remove qualquer formatação para centavos
                const numericValue = parseFloat(numericStr) / Math.pow(10, decimalScale) // Corrige o valor decimal

                // Passa o valor corretamente com centavos
                onChange(isNaN(numericValue) ? '' : numericValue.toFixed(decimalScale))

                setTimeout(() => lockCursorToEnd(), 0)
              }}
              customInput={Input}
              disabled={disabled}
              getInputRef={inputRef}
              onKeyDown={handleKeyDown}
              onMouseDown={handleMouseDown}
              onChange={handleChange}
              onFocus={lockCursorToEnd}
            />
          </InputGroup>

          {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
        </Field.Root>
      )}
    />
  )
}
