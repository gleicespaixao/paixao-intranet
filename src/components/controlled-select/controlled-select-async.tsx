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
  loadOptions: (inputValue?: string, searchTxt?: string) => Promise<TOption[]>
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
      const loadedOptions = await loadOptions('', txt)
      const filteredOptions = applyFilters(loadedOptions)
      setOptions(filteredOptions)
    } catch (error) {
      // tipado como unknown; se quiser, refine para Error
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
            }
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectFirstIfEmpty, field.value, options])

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
                  // selected é TOption | TOption[] | null dependendo do isMulti
                  if (!selected) {
                    field.onChange(multiple ? [] : null)
                    return
                  }
                  const selectedOption = selected as TOption | TOption[]
                  // se for único e vier uma opção desabilitada, ignore
                  if (!multiple && !Array.isArray(selectedOption)) {
                    if ((selectedOption as TOption).isDisabled) return
                  }
                  field.onChange(selectedOption)
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
