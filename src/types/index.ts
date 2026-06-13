export type Regime = 'Presencial' | 'Home office' | 'Híbrido'
export type StatusColaborador = 'Ativo' | 'Desligado'
export type StatusEquipamento = 'Em uso' | 'Home office' | 'Disponível' | 'Pendente devolução'
export type TipoEquipamento =
  | 'Computador'
  | 'Notebook'
  | 'Monitor'
  | 'Teclado'
  | 'Mouse'
  | 'Headset'
  | 'Periférico'
  | 'Impressora'
  | 'Cadeira'
  | 'Outros'
export type Setor =
  | 'Home office'
  | 'Manipulação'
  | 'Administrativo'
  | 'Atendimento'
  | 'RH'
  | 'Estoque'
  | 'Qualidade'

export interface Colaborador {
  id: number
  nome: string
  email: string | null
  setor: Setor | null
  regime: Regime
  status: StatusColaborador
  created_at: string
}

export interface Equipamento {
  id: string
  descricao: string
  tipo: TipoEquipamento | null
  setor: Setor | null
  colaborador_id: number | null
  status: StatusEquipamento
  alugado: boolean
  observacao: string | null
  created_at: string
  colaborador?: Colaborador | null
}

export interface Movimentacao {
  id: number
  data: string
  equipamento_id: string
  acao: string
  colaborador_id: number | null
  responsavel: string | null
  created_at: string
  equipamento?: Equipamento
  colaborador?: Colaborador | null
}
