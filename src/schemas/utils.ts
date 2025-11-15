export const validDdds = [
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
export const phoneRegex = /^\d{10,11}$/

export const isValidCPF = (value: string): boolean => {
  const cpf = value.replace(/\D/g, '') // remove máscara

  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false // rejeita 00000000000, 111...

  let sum = 0
  // 1º dígito verificador
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (10 - i)
  }
  let rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.charAt(9), 10)) return false

  // 2º dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (11 - i)
  }
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.charAt(10), 10)) return false

  return true
}
