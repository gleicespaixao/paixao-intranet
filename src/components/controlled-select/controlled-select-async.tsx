import { Field, Stack } from '@chakra-ui/react'
import { Select, SizeProp } from 'chakra-react-select'
import { useEffect, useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import type { ComponentType } from 'react'
import type { GroupBase, OptionProps, OptionsOrGroups, SelectComponentsConfig } from 'react-select'

/** Opção base: você pode estender com mais campos via genérico */
export type BaseOption = {
  value: string
  label: string
  isDisabled?: boolean
}

type ControlledSelectAsyncProps<TFieldValues extends FieldValues, TOption extends BaseOption = BaseOption> = {
  label?: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  disabled?: boolean
  required?: boolean
  /** Sem any: loadOptions deve devolver TOption[] */
  loadOptions: (inputValue?: string, searchTxt?: string, selectedOptions?: TOption[]) => Promise<TOption[]>
  error?: string
  /** Sem any: recebe TOption */
  getOptionLabel?: (option: TOption) => string
  filters?: Array<{ value: string; status: boolean }>
  /** Sem any: recebe TOption */
  customFilters?: (option: TOption) => boolean
  selectFirstIfEmpty?: boolean
  width?: string | number
  multiple?: boolean
  isFilter?: boolean
  placeholder?: string
  /** Sem any: usa o tipo esperado por react-select */
  customOption?: ComponentType<OptionProps<TOption, boolean, GroupBase<TOption>>>
  size?: SizeProp
}

export type SelectProps<
  TFieldValues extends FieldValues,
  TOption extends BaseOption = BaseOption
> = ControlledSelectAsyncProps<TFieldValues, TOption>

export function ControlledSelectAsync<TFieldValues extends FieldValues, TOption extends BaseOption = BaseOption>({
  label,
  name,
  control,
  disabled,
  required,
  error,
  loadOptions,
  selectFirstIfEmpty,
  width,
  isFilter,
  multiple,
  placeholder,
  getOptionLabel,
  filters = [],
  customFilters,
  customOption,
  size
}: SelectProps<TFieldValues, TOption>) {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<TOption[]>([])
  const [open, setOpen] = useState(false)
  const [searchTxt, setSearchTxt] = useState('')
  const [isSearch, setIsSearch] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<TOption[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (searchTxt && isFilter) {
      const timeoutId = setTimeout(async () => {
        setIsSearch(true)
        fetchOptions(searchTxt)
        setLoading(true)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
    if (isSearch && isFilter && !searchTxt) fetchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTxt])

  const defaultGetOptionLabel = (option: TOption) => option.label ?? ''

  async function fetchOptions(txt?: string) {
    try {
      const loadedOptions = await loadOptions('', txt, selectedOptions)
      const filteredOptions = applyFilters(loadedOptions)
      setOptions(filteredOptions)
    } catch (error) {
      console.error('Erro ao carregar opções:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (opts: TOption[]): TOption[] => {
    const includeFilters = filters.filter((f) => f.status)
    const excludeFilters = filters.filter((f) => !f.status)

    return opts.filter((option) => {
      const optionLabel = getOptionLabel ? getOptionLabel(option) : defaultGetOptionLabel(option)

      const isExcluded = excludeFilters.some((f) => optionLabel.includes(f.value))
      if (isExcluded) return false

      if (includeFilters.length > 0) {
        if (!includeFilters.some((f) => optionLabel.includes(f.value))) return false
      }

      if (customFilters && !customFilters(option)) return false

      return true
    })
  }

  const handleSearch = async () => {
    setLoading(true)
    fetchOptions()
  }

  useEffect(() => {
    if (open) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!isClient) return null

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (selectFirstIfEmpty && !field.value) {
            handleSearch()
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectFirstIfEmpty, field.value])

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (selectFirstIfEmpty && !field.value && options.length) {
            const firstEnabledOption = options.find((o) => !o.isDisabled)
            if (firstEnabledOption) {
              field.onChange(firstEnabledOption)
              setSelectedOptions([firstEnabledOption])
            }
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectFirstIfEmpty, field.value, options])

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (multiple) {
            const arr = (field.value as TOption[]) ?? []
            setSelectedOptions(arr)
          } else if (field.value) {
            setSelectedOptions([field.value as TOption])
          } else {
            setSelectedOptions([])
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [field.value, multiple])

        return (
          <Field.Root required={required} invalid={!!error} width={width}>
            {label && (
              <Field.Label>
                {label}
                <Field.RequiredIndicator />
              </Field.Label>
            )}
            <Stack width="full">
              <Select<TOption, boolean, GroupBase<TOption>>
                onInputChange={setSearchTxt}
                size={size ?? 'md'}
                isMulti={!!multiple}
                instanceId={name}
                menuPlacement="bottom"
                onMenuOpen={() => setOpen(true)}
                onMenuClose={() => setOpen(false)}
                invalid={!!error}
                isDisabled={disabled}
                options={options as unknown as OptionsOrGroups<TOption, GroupBase<TOption>>}
                isLoading={loading}
                filterOption={isFilter ? null : undefined}
                loadingMessage={() => 'Carregando...'}
                placeholder={placeholder || 'Selecione uma opção'}
                value={field.value as unknown as TOption | TOption[] | null}
                onChange={(selected) => {
                  if (!selected) {
                    field.onChange(multiple ? [] : null)
                    setSelectedOptions([])
                    return
                  }

                  const selectedOption = selected as TOption | TOption[]

                  if (!multiple && !Array.isArray(selectedOption)) {
                    if ((selectedOption as TOption).isDisabled) return
                    field.onChange(selectedOption)
                    setSelectedOptions([selectedOption])
                    return
                  }

                  const arr = Array.isArray(selectedOption) ? selectedOption : [selectedOption]
                  field.onChange(selectedOption)
                  setSelectedOptions(arr)
                }}
                noOptionsMessage={() => 'Nenhuma opção disponível'}
                getOptionLabel={getOptionLabel ?? defaultGetOptionLabel}
                components={
                  customOption
                    ? ({
                        Option: customOption
                      } as SelectComponentsConfig<TOption, boolean, GroupBase<TOption>>)
                    : undefined
                }
                styles={{
                  menuPortal: (provided) => ({
                    ...provided,
                    zIndex: 'var(--chakra-z-index-max)'
                  })
                }}
                chakraStyles={{
                  menuList: (provided) => ({
                    ...provided,
                    bg: { _dark: 'bg.muted' }
                  })
                }}
              />
            </Stack>
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
          </Field.Root>
        )
      }}
    />
  )
}
