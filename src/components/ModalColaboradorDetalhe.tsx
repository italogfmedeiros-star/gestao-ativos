import { Modal, BadgeStatus, Avatar } from './ui'
import type { Colaborador, Equipamento } from '../types'

interface Props {
  colaborador: Colaborador
  equipamentos: Equipamento[]
  onClose: () => void
}

export function ModalColaboradorDetalhe({ colaborador, equipamentos, onClose }: Props) {
  const valorTotal = equipamentos.reduce((acc, e) => acc + (e.valor ?? 0), 0)
  const temValor = equipamentos.some(e => e.valor != null)

  return (
    <Modal title="Equipamentos do colaborador" onClose={onClose} width={560}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 10 }}>
        <Avatar nome={colaborador.nome} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{colaborador.nome}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{colaborador.setor ?? ''} — {colaborador.regime}</div>
        </div>
        <span style={{
          marginLeft: 'auto', background: '#eff6ff', color: '#2563eb',
          borderRadius: 10, padding: '2px 10px', fontSize: 12, fontWeight: 700,
        }}>
          {equipamentos.length} equip.
        </span>
      </div>

      {equipamentos.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
          Nenhum equipamento vinculado.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {equipamentos.map(eq => (
              <div key={eq.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', width: 64, flexShrink: 0 }}>{eq.id}</span>
                <span style={{ flex: 1, fontSize: 13, color: '#374151' }}>{eq.descricao}</span>
                <span style={{ fontSize: 12, color: '#9ca3af', flexShrink: 0 }}>{eq.tipo ?? ''}</span>
                <BadgeStatus status={eq.status} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', width: 90, textAlign: 'right', flexShrink: 0 }}>
                  {eq.valor != null
                    ? eq.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : <span style={{ color: '#d1d5db' }}>—</span>}
                </span>
              </div>
            ))}
          </div>

          {temValor && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', background: '#f0fdf4', borderRadius: 10,
              border: '1px solid #bbf7d0',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#15803d' }}>Total em posse</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#15803d' }}>
                {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
