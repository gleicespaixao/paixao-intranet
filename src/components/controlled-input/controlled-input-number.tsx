import * as React from 'react'
import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form'
import { Field, type InputProps as ChakraInputProps, NumberInput, Box } from '@chakra-ui/react'

type PassThroughProps = Omit<ChakraInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'type'>

export type ControlledInputNumberProps<TFieldValues extends FieldValues> = PassThroughProps & {
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  label?: string
  error?: string
  invalid?: boolean
  endElement?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
  min?: number
  max?: number
  step?: number
  w?: string | number
  isPercent?: boolean
  disabled?: boolean
}

export function ControlledInputNumber<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  invalid,
  endElement,
  min,
  max,
  step,
  w,
  isPercent = false,
  disabled,
  ...rest
}: ControlledInputNumberProps<TFieldValues>) {
  return (
    <Controller<TFieldValues>
      name={name}
      control={control}
      render={({ field }) => {
        const raw = field.value

        const numeric =
          typeof raw === 'number' ? raw : raw !== null && raw !== undefined && raw !== '' ? Number(raw) : undefined

        const displayNumber =
          numeric === undefined || Number.isNaN(numeric)
            ? ''
            : isPercent
              ? numeric * 100 // 0.5 → 50
              : numeric

        const displayValue = displayNumber === '' ? '' : String(displayNumber)

        const uiMin = isPercent && typeof min === 'number' ? min * 100 : min
        const uiMax = isPercent && typeof max === 'number' ? max * 100 : max

        return (
          <Field.Root required={rest.required} invalid={Boolean(error) || Boolean(invalid)}>
            {label ? (
              <Field.Label>
                {label}
                <Field.RequiredIndicator />
              </Field.Label>
            ) : null}

            <Box position="relative" w={w ?? 'full'}>
              <NumberInput.Root
                disabled={disabled}
                value={displayValue}
                min={uiMin}
                max={uiMax}
                step={step}
                onValueChange={({ valueAsNumber }) => {
                  if (typeof valueAsNumber === 'number' && !Number.isNaN(valueAsNumber)) {
                    const next = isPercent
                      ? valueAsNumber / 100 // 50 → 0.5
                      : valueAsNumber

                    field.onChange(next)
                  } else {
                    field.onChange(undefined)
                  }
                }}
              >
                <NumberInput.Input
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  pr={endElement ? 7 : rest.pr}
                />
              </NumberInput.Root>

              {endElement && (
                <Box
                  position="absolute"
                  right="2"
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                  color="fg.muted"
                  fontSize="sm"
                >
                  {endElement}
                </Box>
              )}
            </Box>

            {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
          </Field.Root>
        )
      }}
    />
  )
}
