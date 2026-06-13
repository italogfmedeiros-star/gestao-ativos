import { useState } from 'react'
import { Modal, Field, Input, Select, Textarea, Btn } from './ui'
import type { Equipamento, Colaborador, TipoEquipamento, Setor } from '../types'

const TIPOS: TipoEquipamento[] = ['Computador', 'Notebook', 'Monitor', 'Teclado', 'Mouse', 'Headset', 'Periférico', 'Impressora', 'Cadeira', 'Outros']
const SETORES: Setor[] = ['Administrativo', 'Controle de qualidade', 'Expedição', 'Farmaceutico', 'Home Office', 'Inclusão', 'Laboratorio UE', 'Laboratorio UI', 'Orçamento', 'Recepção', 'Vendas']

interface Props {
  equipamento?: Equipamento | null
  colaboradores: Colaborador[]
  onSave: (data: Partial<Equipamento> & { id: string; descricao: string }) => Promise<void>
  onClose: () => void
}

export function ModalEquipamento({ equipamento, colaboradores, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    id: equipamento?.id ?? '',
    descricao: equipamento?.descricao ?? '',
    tipo: equipamento?.tipo ?? '',
    setor: equipamento?.setor ?? '',
    colaborador_id: equipamento?.colaborador_id?.toString() ?? '',
    status: equipamento?.status ?? 'Disponível',
    alugado: equipamento?.alugado ?? false,
    observacao: equipamento?.observacao ?? '',
  })
  const [saving, setSaving] = useState(false)
  const isEdit = !!equipamento

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.id.trim() || !form.descricao.trim()) return
    setSaving(true)
    await onSave({
      id: form.id.trim().toUpperCase(),
      descricao: form.descricao.trim(),
      tipo: (form.tipo || null) as TipoEquipamento | null,
      setor: (form.setor || null) as Setor | null,
      colaborador_id: form.colaborador_id ? Number(form.colaborador_id) : null,
      status: form.status as Equipamento['status'],
      alugado: form.alugado,
      observacao: form.observacao.trim() || null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={isEdit ? 'Editar equipamento' : 'Novo equipamento'} onClose={onClose}>
      <Field label="Código (etiqueta) *">
        <Input
          value={form.id} placeholder="DF-034"
          onChange={e => set('id', e.target.value)}
          disabled={isEdit}
        />
      </Field>
      <Field label="Descrição *">
        <Input value={form.descricao} placeholder="Ex: All in One Positivo" onChange={e => set('descricao', e.target.value)} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Tipo">
          <Select value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            <option value="">Selecionar...</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Setor">
          <Select value={form.setor} onChange={e => set('setor', e.target.value)}>
            <option value="">Selecionar...</option>
            {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Colaborador responsável">
        <Select value={form.colaborador_id} onChange={e => set('colaborador_id', e.target.value)}>
          <option value="">Sem responsável</option>
          {colaboradores.filter(c => c.status === 'Ativo').map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </Select>
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={e => set('status', e.target.value)}>
          <option>Em uso</option>
          <option>Home office</option>
          <option>Disponível</option>
          <option>Pendente devolução</option>
        </Select>
      </Field>
      <Field label="Observação">
        <Textarea value={form.observacao} placeholder="Informações adicionais..." onChange={e => set('observacao', e.target.value)} />
      </Field>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, cursor: 'pointer', fontSize: 14 }}>
        <input type="checkbox" checked={form.alugado} onChange={e => set('alugado', e.target.checked)} />
        Equipamento alugado
      </label>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={handleSave} disabled={saving || !form.id || !form.descricao}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Btn>
      </div>
    </Modal>
  )
}
