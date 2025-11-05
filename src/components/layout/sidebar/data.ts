import { BiBuildings, BiCategoryAlt, BiGroup, BiUserVoice } from 'react-icons/bi'
import { IconType } from 'react-icons/lib'

type NavItem = {
  label: string
  href?: string
  icon?: IconType
  children?: Array<{ label: string; href: string }>
}

export const sidebarData: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: BiCategoryAlt },
  { label: 'Clientes', href: '/customer', icon: BiUserVoice },
  {
    label: 'Empreendimentos',
    icon: BiBuildings,
    children: [
      { label: 'Projetos', href: '/developments/development' },
      { label: 'Bairros', href: '/developments/neighborhood' },
      { label: 'Tipos de imóvel', href: '/developments/type-of-property' }
    ]
  },
  {
    label: 'Equipes',
    icon: BiGroup,
    children: [
      { label: 'Usuários', href: '/teams/user' },
      { label: 'Perfis', href: '/teams/profile' }
    ]
  }
]
