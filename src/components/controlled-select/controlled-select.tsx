import { createListCollection, Field, Portal, SelectPositioner } from '@chakra-ui/react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'

type SelectPrimeProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  items: { value: string; label: string; disabled?: boolean }[]
  placeholder?: string
  onChange?: (selectedOption: { value: string; label: string } | null) => void
  error?: string
  label?: string
  multiple?: boolean
  flip?: boolean
  defaultValues?: string[]
  selectLabel?: string
  disabled?: boolean
  required?: boolean
  isDialog?: boolean
}

export type SelectProps<TFieldValues extends FieldValues> = SelectPrimeProps<TFieldValues>

export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  placeholder,
  items,
  error,
  isDialog,
  selectLabel,
  label,
  disabled,
  required,
  defaultValues,
  flip = true,
  multiple = false
}: SelectProps<T>) {
  const collection = createListCollection({ items })

  function renderSelectContent() {
    return (
      <SelectContent bg={{ _dark: 'bg.muted' }} zIndex="max">
        {collection.items.map((option) => (
          <SelectItem item={option} key={option.value} cursor="pointer">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // value SEMPRE como array para o SelectRoot
        const valueArray: string[] = Array.isArray(field.value)
          ? (field.value as (string | null | undefined)[]).filter((v): v is string => v != null && v !== '')
          : field.value != null && field.value !== ''
            ? [String(field.value)]
            : []

        // defaultValue também deve ser array
        const defaultArray: string[] = Array.isArray(defaultValues) ? defaultValues : []

        // Para mostrar o label atual no placeholder quando single
        const currentValue = valueArray[0]
        const selectedItem = items.find((i) => i.value === currentValue)
        const displayLabel = selectedItem?.label ?? placeholder

        return (
          <Field.Root required={required} invalid={!!error}>
            {label && (
              <Field.Label>
                {label}
                <Field.RequiredIndicator />
              </Field.Label>
            )}

            <SelectRoot
              collection={collection}
              value={valueArray}
              defaultValue={defaultArray}
              multiple={multiple}
              disabled={disabled}
              positioning={{ placement: 'bottom', flip, strategy: 'fixed', hideWhenDetached: true }}
              onValueChange={(newValue) => {
                // Ark/Chakra Select envia { value: string[] }
                const arr = Array.isArray(newValue?.value) ? newValue.value : []
                if (multiple) {
                  field.onChange(arr)
                } else {
                  const first = arr[0] ?? ''
                  field.onChange(first) // RHF recebe string
                }
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder={displayLabel} selectLabel={selectLabel} />
              </SelectTrigger>

              {isDialog ? (
                <Portal>
                  <SelectPositioner zIndex={1500}>{renderSelectContent()}</SelectPositioner>
                </Portal>
              ) : (
                renderSelectContent()
              )}
            </SelectRoot>
          </Field.Root>
        )
      }}
    />
  )
}
