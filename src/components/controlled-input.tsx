import * as React from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Field, Input as CInput, Group, InputAddon, type InputProps as ChakraInputProps } from '@chakra-ui/react'

type PassThroughProps = Omit<ChakraInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'type'>

export type ControlledInputProps<TFieldValues extends FieldValues> = PassThroughProps & {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  error?: string
  invalid?: boolean
  type?: React.HTMLInputTypeAttribute
  inputAddonLeft?: React.ReactNode
  inputAddonRight?: React.ReactNode
}

export function ControlledInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  invalid,
  type = 'text',
  inputAddonLeft,
  inputAddonRight,
  ...rest
}: ControlledInputProps<TFieldValues>) {
  const hasAddon = Boolean(inputAddonLeft || inputAddonRight)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field.Root invalid={Boolean(error) || Boolean(invalid)}>
          {label ? <Field.Label>{label}</Field.Label> : null}

          {hasAddon ? (
            <Group attached w="full">
              {inputAddonLeft ? <InputAddon>{inputAddonLeft}</InputAddon> : null}
              <CInput type={type} {...field} {...rest} />
              {inputAddonRight ? <InputAddon>{inputAddonRight}</InputAddon> : null}
            </Group>
          ) : (
            <CInput type={type} {...field} {...rest} />
          )}

          {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
        </Field.Root>
      )}
    />
  )
}
