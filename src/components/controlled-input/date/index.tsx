import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import 'react-multi-date-picker/styles/colors/teal.css'

import { FieldErrorText, FieldLabel, Input as ChakraInput } from '@chakra-ui/react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import DatePicker, { DateObject } from 'react-multi-date-picker'

import { useColorMode } from '@/components/ui/color-mode'
import { Field } from '@/components/ui/field'
import { InputGroup } from '@/components/ui/input-group'

import { ClearInput } from './clear-input'
import ptBR from './pt-br'

type DateInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  error?: string
  placeholder?: string
  disabled?: boolean
  maxDate?: DateObject
  minDate?: DateObject
  label?: string
  disableWeekend?: boolean
  disablePortal?: boolean
  borderColor?: string
  closeButton?: boolean
}

export function ControlledInputDate<T extends FieldValues>({
  name,
  control,
  error,
  placeholder = 'DD/MM/AAAA',
  disabled,
  borderColor,
  maxDate,
  label,
  minDate,
  disableWeekend,
  disablePortal,
  closeButton = false
}: DateInputProps<T>) {
  const { colorMode } = useColorMode()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value: inputCalendarValue, onChange } }) => {
        return (
          <Field invalid={!!error}>
            {label && <FieldLabel>{label}</FieldLabel>}
            <DatePicker
              zIndex={9999}
              value={inputCalendarValue ? new DateObject(inputCalendarValue) : null}
              onChange={(date) => onChange(date ? (date as DateObject).toDate() : null)}
              format="DD/MM/YYYY"
              placeholder={placeholder}
              locale={ptBR}
              editable={true}
              maxDate={maxDate ?? undefined}
              minDate={minDate ?? undefined}
              disabled={disabled}
              portal={!disablePortal}
              portalTarget={typeof document !== 'undefined' ? document.body : undefined}
              className={colorMode === 'dark' ? 'bg-dark' : 'teal'}
              render={(value, openCalendar, handleValueChange) => {
                const formatDateInput = (val: string) => {
                  const digits = val.replace(/\D/g, '').slice(0, 8)
                  const parts: string[] = []
                  if (digits.length > 0) parts.push(digits.substring(0, 2))
                  if (digits.length > 2) parts.push(digits.substring(2, 4))
                  if (digits.length > 4) parts.push(digits.substring(4, 8))
                  return parts.join('/')
                }

                const handleMaskedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const formatted = formatDateInput(e.target.value)

                  // cria um ChangeEvent<HTMLInputElement> com o valor formatado
                  const syntheticEvent = {
                    ...e,
                    target: { ...e.target, value: formatted },
                    currentTarget: { ...e.currentTarget, value: formatted }
                  } as unknown as React.ChangeEvent<HTMLInputElement>

                  handleValueChange(syntheticEvent)
                }

                return (
                  <InputGroup
                    flex="1"
                    endElement={
                      closeButton ? <ClearInput disabled={!!disabled} onChange={onChange} value={value} /> : null
                    }
                    w="full"
                  >
                    <ChakraInput
                      borderColor={borderColor}
                      placeholder={placeholder}
                      w="full"
                      autoComplete="off"
                      value={value}
                      disabled={disabled}
                      onChange={handleMaskedChange}
                      onClick={openCalendar}
                    />
                  </InputGroup>
                )
              }}
              containerStyle={{
                width: '100%'
              }}
              mapDays={
                disableWeekend
                  ? ({ date }) => {
                      const isWeekend = [0, 6].includes(date.weekDay.index)

                      if (isWeekend) return { disabled: true }
                    }
                  : undefined
              }
            />
            {error && <FieldErrorText>{error}</FieldErrorText>}
          </Field>
        )
      }}
    />
  )
}
