import z from 'zod'

const validDdds = [
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '21',
  '22',
  '24',
  '27',
  '28',
  '31',
  '32',
  '33',
  '34',
  '35',
  '37',
  '38',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '51',
  '53',
  '54',
  '55',
  '61',
  '62',
  '64',
  '63',
  '65',
  '66',
  '67',
  '68',
  '69',
  '71',
  '73',
  '74',
  '75',
  '77',
  '79',
  '81',
  '87',
  '82',
  '83',
  '84',
  '85',
  '88',
  '86',
  '89',
  '91',
  '93',
  '94',
  '92',
  '97',
  '95',
  '96',
  '98',
  '99'
]

// Regex básica para (99) 99999-9999 ou (99) 9999-9999
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/

export const schemaUserSimple = z.object({
  name: z.string().min(3, 'Informe seu nome'),
  surname: z.string().min(3, 'Informe seu sobrenome'),
  email: z.string().email('E-mail inválido'),
  dateBirth: z.date('Data de nascimento inválida'),
  phone: z
    .string()
    .regex(phoneRegex, 'Número de telefone inválido')
    .regex(phoneRegex, 'Número de telefone inválido')
    .refine(
      (val) => {
        const ddd = val.match(/\((\d{2})\)/)?.[1]
        return ddd ? validDdds.includes(ddd) : false
      },
      {
        message: 'DDD inválido'
      }
    )
})
export type UserSimpleForm = z.infer<typeof schemaUserSimple>
