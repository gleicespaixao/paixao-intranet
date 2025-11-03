// src/components/form/controlled-password-input.tsx
import * as React from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Field } from '@chakra-ui/react'
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input'
import { passwordStrength, type Options } from 'check-password-strength'

type InputSlotProps = React.ComponentProps<typeof PasswordInput>

// Props que podem passar direto pro <PasswordInput />
type PassThroughProps = Omit<InputSlotProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'type'>

export type ControlledPasswordInputProps<TFieldValues extends FieldValues> = PassThroughProps & {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  error?: string
  invalid?: boolean
  showStrengthMeter?: boolean
  strengthOptions?: Options<string>
  meterProps?: React.ComponentProps<typeof PasswordStrengthMeter>
}

// defaults da doc
const defaultStrengthOptions: Options<string> = [
  { id: 1, value: 'fraca', minDiversity: 0, minLength: 0 },
  { id: 2, value: 'média', minDiversity: 2, minLength: 6 },
  { id: 3, value: 'forte', minDiversity: 3, minLength: 8 },
  { id: 4, value: 'muito forte', minDiversity: 4, minLength: 10 }
]

export function ControlledPasswordInput<TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Password',
  error,
  invalid,
  showStrengthMeter,
  strengthOptions,
  meterProps,
  ...rest
}: ControlledPasswordInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = (field.value ?? '') as string

        // calcula força (sem hooks dentro do render)
        const strength = showStrengthMeter
          ? value
            ? passwordStrength(value, strengthOptions ?? defaultStrengthOptions).id
            : 0
          : 0

        return (
          <Field.Root invalid={Boolean(error) || Boolean(invalid)}>
            {label ? <Field.Label>{label}</Field.Label> : null}

            <PasswordInput {...field} {...rest} />

            {showStrengthMeter && value ? <PasswordStrengthMeter w="full" value={strength} {...meterProps} /> : null}

            {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
          </Field.Root>
        )
      }}
    />
  )
}
