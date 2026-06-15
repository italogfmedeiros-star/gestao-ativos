import { useState } from 'react'
import { Modal, Field, Input, Btn } from './ui'
import type { Colaborador, Equipamento } from '../types'

interface Props {
  colaborador: Colaborador
  equipamentos: Equipamento[]
  onConfirm: (devolvidos: string[], responsavel: string) => Promise<void>
  onClose: () => void
}

export function ModalDesligamento({ colaborador, equipamentos, onConfirm, onClose }: Props) {
  const [responsavel, setResponsavel] = useState('')
  const [saving, setSaving] = useState(false)

  const handleConfirm = async () => {
    setSaving(true)
    await onConfirm([], responsavel)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={`Desligar — ${colaborador.nome}`} onClose={onClose} width={480}>
      <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>
        Todos os equipamentos vinculados serão automaticamente marcados como{' '}
        <strong>Disponível</strong> e desvinculados do colaborador.
      </p>

      {equipamentos.length > 0 && (
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8,
          padding: '12px 14px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Equipamentos afetados ({equipamentos.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {equipamentos.map(eq => (
              <div key={eq.id} style={{ fontSize: 13, color: '#374151' }}>
                <strong style={{ color: '#2563eb' }}>{eq.id}</strong> — {eq.descricao}
              </div>
            ))}
          </div>
        </div>
      )}

      <Field label="Responsável pelo processo">
        <Input
          value={responsavel}
          placeholder="Nome de quem está registrando"
          onChange={e => setResponsavel(e.target.value)}
        />
      </Field>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn variant="danger" onClick={handleConfirm} disabled={saving}>
          {saving ? 'Processando...' : 'Confirmar desligamento'}
        </Btn>
      </div>
    </Modal>
  )
}
