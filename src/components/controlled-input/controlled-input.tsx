import * as React from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Field, Input as CInput, type InputProps as ChakraInputProps } from '@chakra-ui/react'
import { InputGroup } from '../ui/input-group'

type PassThroughProps = Omit<ChakraInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'type'>

export type ControlledInputProps<TFieldValues extends FieldValues> = PassThroughProps & {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  error?: string
  invalid?: boolean
  type?: React.HTMLInputTypeAttribute
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
}

export function ControlledInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  invalid,
  type = 'text',
  startElement,
  endElement,
  ...rest
}: ControlledInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field.Root invalid={Boolean(error) || Boolean(invalid)}>
          {label ? <Field.Label>{label}</Field.Label> : null}

          <InputGroup w="full" startElement={startElement} endElement={endElement}>
            <CInput type={type} {...field} {...rest} />
          </InputGroup>

          {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
        </Field.Root>
      )}
    />
  )
}
