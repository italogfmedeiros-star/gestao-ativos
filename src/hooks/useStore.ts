import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Colaborador, Equipamento, Movimentacao, MotivoBaixa, StatusEquipamento } from '../types'

interface Store {
  colaboradores: Colaborador[]
  equipamentos: Equipamento[]
  movimentacoes: Movimentacao[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  saveColaborador: (data: Partial<Colaborador> & { nome: string }) => Promise<void>
  saveEquipamento: (data: Partial<Equipamento> & { id: string; descricao: string }) => Promise<void>
  deleteEquipamento: (id: string) => Promise<void>
  alocarEquipamento: (equipamentoId: string, colaboradorId: number | null, responsavel: string) => Promise<void>
  desligarColaborador: (colaboradorId: number, devolvidos: string[], responsavel: string) => Promise<void>
  baixarEquipamento: (equipamentoId: string, motivo: MotivoBaixa, observacao: string) => Promise<void>
}

export function useStore(): Store {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [{ data: cols }, { data: equips }, { data: movs }] = await Promise.all([
        supabase.from('colaboradores').select('*').order('nome'),
        supabase.from('equipamentos').select('*, colaborador:colaboradores(*)').order('id'),
        supabase.from('movimentacoes').select('*, equipamento:equipamentos(id,descricao), colaborador:colaboradores(id,nome)').order('created_at', { ascending: false }).limit(100),
      ])
      setColaboradores((cols as Colaborador[]) ?? [])
      setEquipamentos((equips as Equipamento[]) ?? [])
      setMovimentacoes((movs as Movimentacao[]) ?? [])
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const saveColaborador = async (data: Partial<Colaborador> & { nome: string }) => {
    if (data.id) {
      await supabase.from('colaboradores').update(data).eq('id', data.id)
    } else {
      await supabase.from('colaboradores').insert(data)
    }
    await load()
  }

  const saveEquipamento = async (data: Partial<Equipamento> & { id: string; descricao: string }) => {
    const { colaborador: _, ...row } = data as Equipamento
    const exists = equipamentos.some(e => e.id === row.id)
    if (exists) {
      await supabase.from('equipamentos').update(row).eq('id', row.id)
    } else {
      await supabase.from('equipamentos').insert(row)
    }
    await load()
  }

  const deleteEquipamento = async (id: string) => {
    await supabase.from('movimentacoes').delete().eq('equipamento_id', id)
    await supabase.from('equipamentos').delete().eq('id', id)
    await load()
  }

  const alocarEquipamento = async (equipamentoId: string, colaboradorId: number | null, responsavel: string) => {
    const colaborador = colaboradores.find(c => c.id === colaboradorId)
    let novoStatus: StatusEquipamento = 'Disponível'
    if (colaborador) {
      novoStatus = colaborador.regime === 'Home office' || colaborador.regime === 'Híbrido'
        ? 'Home office'
        : 'Em uso'
    }

    await supabase.from('equipamentos').update({
      colaborador_id: colaboradorId,
      status: novoStatus,
      setor: colaborador?.setor ?? null,
    }).eq('id', equipamentoId)

    const acao = colaborador
      ? `Alocado para ${colaborador.nome}`
      : 'Desalocado — disponível'

    await supabase.from('movimentacoes').insert({
      data: new Date().toISOString().split('T')[0],
      equipamento_id: equipamentoId,
      acao,
      colaborador_id: colaboradorId,
      responsavel,
    })

    await load()
  }

  const desligarColaborador = async (colaboradorId: number, _devolvidos: string[], responsavel: string) => {
    const equipamentosDoColaborador = equipamentos.filter(e => e.colaborador_id === colaboradorId)

    for (const eq of equipamentosDoColaborador) {
      await supabase.from('equipamentos').update({
        status: 'Disponível',
        colaborador_id: null,
      }).eq('id', eq.id)

      await supabase.from('movimentacoes').insert({
        data: new Date().toISOString().split('T')[0],
        equipamento_id: eq.id,
        acao: 'Disponível — desligamento de colaborador',
        colaborador_id: colaboradorId,
        responsavel,
      })
    }

    await supabase.from('colaboradores').update({ status: 'Desligado' }).eq('id', colaboradorId)
    await load()
  }

  const baixarEquipamento = async (equipamentoId: string, motivo: MotivoBaixa, observacao: string) => {
    await supabase.from('equipamentos').update({
      status: 'Baixado',
      colaborador_id: null,
    }).eq('id', equipamentoId)

    await supabase.from('movimentacoes').insert({
      data: new Date().toISOString().split('T')[0],
      equipamento_id: equipamentoId,
      acao: `Baixa — ${motivo}${observacao ? ': ' + observacao : ''}`,
      colaborador_id: null,
      responsavel: null,
    })

    await load()
  }

  return {
    colaboradores,
    equipamentos,
    movimentacoes,
    loading,
    error,
    reload: load,
    saveColaborador,
    saveEquipamento,
    deleteEquipamento,
    alocarEquipamento,
    desligarColaborador,
    baixarEquipamento,
  }
}
