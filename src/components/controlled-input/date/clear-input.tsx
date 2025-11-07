import { IconButton } from '@chakra-ui/react'
import { BiX } from 'react-icons/bi'

export const ClearInput = ({
  value,
  onChange,
  disabled
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  if (!value) return null

  const handleClearInput = () => {
    onChange('')
  }

  return (
    <IconButton
      aria-label="Limpar campo de pesquisa"
      variant="ghost"
      disabled={disabled}
      rounded="full"
      size="xs"
      onClick={handleClearInput}
    >
      <BiX />
    </IconButton>
  )
}
