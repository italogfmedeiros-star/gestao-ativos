export type Regime = 'Presencial' | 'Home office' | 'Híbrido'
export type StatusColaborador = 'Ativo' | 'Desligado'
export type StatusEquipamento = 'Em uso' | 'Home office' | 'Disponível' | 'Pendente devolução' | 'Baixado'
export type MotivoBaixa = 'Upgrade' | 'Defeito' | 'Perda' | 'Obsolescência'
export type TipoEquipamento =
  | 'All in one'
  | 'Computador'
  | 'Notebook'
  | 'Monitor'
  | 'Teclado'
  | 'Mouse'
  | 'Headset'
  | 'Periférico'
  | 'Impressora'
  | 'Smartphone'
  | 'Outros'
export type Setor =
  | 'Administrativo'
  | 'Controle de qualidade'
  | 'Expedição'
  | 'Farmaceutico'
  | 'Home Office'
  | 'Inclusão'
  | 'Laboratorio UE'
  | 'Laboratorio UI'
  | 'Marketing'
  | 'Orçamento'
  | 'Recepção'
  | 'Recursos humanos'
  | 'Vendas'

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
  valor: number | null
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
