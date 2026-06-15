import { useState } from 'react'
import { Modal, Field, Select, Textarea, Btn } from './ui'
import type { Equipamento, MotivoBaixa } from '../types'

interface Props {
  equipamento: Equipamento
  onConfirm: (motivo: MotivoBaixa, observacao: string) => Promise<void>
  onClose: () => void
}

const MOTIVOS: MotivoBaixa[] = ['Upgrade', 'Defeito', 'Perda', 'Obsolescência']

export function ModalBaixaEquipamento({ equipamento, onConfirm, onClose }: Props) {
  const [motivo, setMotivo] = useState<MotivoBaixa>('Upgrade')
  const [observacao, setObservacao] = useState('')
  const [saving, setSaving] = useState(false)

  const handleConfirm = async () => {
    setSaving(true)
    await onConfirm(motivo, observacao)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={`Baixa — ${equipamento.id}`} onClose={onClose} width={480}>
      <div style={{
        background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8,
        padding: '12px 14px', marginBottom: 20,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{equipamento.descricao}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
          {equipamento.tipo ?? ''}{equipamento.tipo && equipamento.colaborador ? ' · ' : ''}
          {(equipamento.colaborador as any)?.nome ?? ''}
        </div>
      </div>

      <Field label="Motivo da baixa">
        <Select value={motivo} onChange={e => setMotivo(e.target.value as MotivoBaixa)}>
          {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>
      </Field>

      <Field label="Observação">
        <Textarea
          value={observacao}
          placeholder="Ex: substituído pelo DF-039, defeito na placa-mãe..."
          onChange={e => setObservacao(e.target.value)}
        />
      </Field>

      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
        O equipamento será marcado como <strong>Baixado</strong> e desvinculado do colaborador, se houver.
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn variant="danger" onClick={handleConfirm} disabled={saving}>
          {saving ? 'Processando...' : 'Confirmar baixa'}
        </Btn>
      </div>
    </Modal>
  )
}
