type DocInput = string | number | null | undefined

function onlyDigits(input: DocInput): string {
  if (input == null) return ''
  return String(input).replace(/\D/g, '')
}

/** Formata CPF. Ex.: "12345678909" -> "123.456.789-09" */
export function formatCPF(input: DocInput): string {
  const d = onlyDigits(input).slice(0, 11)
  if (!d) return ''

  // montagem incremental para suportar parcial
  let out = d
  if (d.length > 3) out = d.slice(0, 3) + '.' + d.slice(3)
  if (d.length > 6) out = out.slice(0, 7) + '.' + out.slice(7)
  if (d.length > 9) out = out.slice(0, 11) + '-' + out.slice(11)
  return out
}

/** Formata CNPJ. Ex.: "12345678000190" -> "12.345.678/0001-90" */
export function formatCNPJ(input: DocInput): string {
  const d = onlyDigits(input).slice(0, 14)
  if (!d) return ''

  let out = d
  if (d.length > 2) out = d.slice(0, 2) + '.' + d.slice(2)
  if (d.length > 5) out = out.slice(0, 6) + '.' + out.slice(6)
  if (d.length > 8) out = out.slice(0, 10) + '/' + out.slice(10)
  if (d.length > 12) out = out.slice(0, 15) + '-' + out.slice(15)
  return out
}
