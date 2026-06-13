import { useState } from 'react'
import { Modal, Field, Input, Btn, BadgeStatus } from './ui'
import type { Colaborador, Equipamento } from '../types'

interface Props {
  colaborador: Colaborador
  equipamentos: Equipamento[]
  onConfirm: (devolvidos: string[], responsavel: string) => Promise<void>
  onClose: () => void
}

export function ModalDesligamento({ colaborador, equipamentos, onConfirm, onClose }: Props) {
  const [devolvidos, setDevolvidos] = useState<string[]>([])
  const [responsavel, setResponsavel] = useState('')
  const [saving, setSaving] = useState(false)

  const toggle = (id: string) =>
    setDevolvidos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleConfirm = async () => {
    setSaving(true)
    await onConfirm(devolvidos, responsavel)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={`Desligar â€” ${colaborador.nome}`} onClose={onClose} width={560}>
      <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>
        Marque os equipamentos que foram devolvidos. Os nÃ£o marcados ficarÃ£o como{' '}
        <strong>Pendente devoluÃ§Ã£o</strong>.
      </p>
      {equipamentos.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Nenhum equipamento vinculado.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {equipamentos.map(eq => (
            <label
              key={eq.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', border: '1px solid #e5e7eb',
                borderRadius: 8, cursor: 'pointer',
                background: devolvidos.includes(eq.id) ? '#f0fdf4' : '#fff',
              }}
            >
              <input
                type="checkbox"
                checked={devolvidos.includes(eq.id)}
                onChange={() => toggle(eq.id)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ flex: 1, fontSize: 14 }}>
                <strong>{eq.id}</strong> â€” {eq.descricao}
              </span>
              <BadgeStatus status={eq.status} />
            </label>
          ))}
        </div>
      )}
      <Field label="ResponsÃ¡vel pelo processo">
        <Input
          value={responsavel}
          placeholder="Nome de quem estÃ¡ registrando"
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

