import { Box, BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FieldValues, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form'

type FormProps<T extends FieldValues> = Omit<BoxProps, 'onSubmit'> & {
  children: ReactNode
  hookFormHandleSubmit: UseFormHandleSubmit<T>
  onSubmit: SubmitHandler<T>
}

export function Form<T extends FieldValues>({ children, hookFormHandleSubmit, onSubmit, ...rest }: FormProps<T>) {
  return (
    <Box as="form" id={rest.id} onSubmit={hookFormHandleSubmit(onSubmit)} {...rest}>
      {children}
    </Box>
  )
}
