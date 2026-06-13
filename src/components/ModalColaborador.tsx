import { useState } from 'react'
import { Modal, Field, Input, Select, Btn } from './ui'
import type { Colaborador, Regime, Setor } from '../types'

const REGIMES: Regime[] = ['Presencial', 'Home office', 'Híbrido']
const SETORES: Setor[] = ['Home office', 'Manipulação', 'Administrativo', 'Atendimento', 'RH', 'Estoque', 'Qualidade']

interface Props {
  colaborador?: Colaborador | null
  onSave: (data: Partial<Colaborador> & { nome: string }) => Promise<void>
  onClose: () => void
}

export function ModalColaborador({ colaborador, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    nome: colaborador?.nome ?? '',
    email: colaborador?.email ?? '',
    setor: colaborador?.setor ?? '',
    regime: colaborador?.regime ?? 'Home office' as Regime,
  })
  const [saving, setSaving] = useState(false)
  const isEdit = !!colaborador

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.nome.trim()) return
    setSaving(true)
    await onSave({
      ...(isEdit ? { id: colaborador!.id } : {}),
      nome: form.nome.trim(),
      email: form.email.trim() || null,
      setor: (form.setor || null) as Setor | null,
      regime: form.regime,
      status: colaborador?.status ?? 'Ativo',
    })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={isEdit ? 'Editar colaborador' : 'Novo colaborador'} onClose={onClose}>
      <Field label="Nome *">
        <Input value={form.nome} placeholder="Nome completo" onChange={e => set('nome', e.target.value)} />
      </Field>
      <Field label="E-mail">
        <Input type="email" value={form.email} placeholder="email@dermaflora.com.br" onChange={e => set('email', e.target.value)} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Setor">
          <Select value={form.setor} onChange={e => set('setor', e.target.value)}>
            <option value="">Selecionar...</option>
            {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Regime">
          <Select value={form.regime} onChange={e => set('regime', e.target.value)}>
            {REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={handleSave} disabled={saving || !form.nome}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Btn>
      </div>
    </Modal>
  )
}
