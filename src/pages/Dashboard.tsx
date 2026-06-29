import { useState } from 'react'
import { Avatar } from '../components/ui'
import type { Equipamento, Movimentacao, TipoEquipamento } from '../types'

interface Props {
  equipamentos: Equipamento[]
  movimentacoes: Movimentacao[]
}

interface MetricCardProps {
  label: string
  value: number | string
  accent: string
  flexBasis?: string
}

function MetricCard({ label, value, accent, flexBasis = '1 1 150px' }: MetricCardProps) {
  return (
    <div style={{
      flex: flexBasis,
      background: 'rgba(241,245,249,0.7)',
      border: '1px solid rgba(226,232,240,0.5)',
      borderRadius: 20, padding: 6,
      boxShadow: '0 0 0 1px rgba(255,255,255,0.85) inset',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 15,
        padding: '18px 20px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent, opacity: 0.9 }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#94a3b8', marginBottom: 14,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
          {label}
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {value}
        </div>
      </div>
    </div>
  )
}

const TIPOS: TipoEquipamento[] = ['All in one', 'Computador', 'Notebook', 'Monitor', 'Teclado', 'Mouse', 'Headset', 'Periférico', 'Impressora', 'Smartphone', 'Outros']

export function Dashboard({ equipamentos, movimentacoes }: Props) {
  const [filterTipo, setFilterTipo] = useState('')

  const ativos = equipamentos.filter(e => e.status !== 'Baixado')
  const filtrados = filterTipo ? ativos.filter(e => e.tipo === filterTipo) : ativos

  const total = filtrados.length
  const emUso = filtrados.filter(e => e.status === 'Em uso').length
  const homeOffice = filtrados.filter(e => e.status === 'Home office').length
  const disponiveis = filtrados.filter(e => e.status === 'Disponível').length
  const pendentes = filtrados.filter(e => e.status === 'Pendente devolução').length
  const valorTotal = filtrados.reduce((acc, e) => acc + (e.valor ?? 0), 0)
  const valorFormatado = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <MetricCard label={filterTipo ? `Total — ${filterTipo}` : 'Total de equipamentos'} value={total}       accent="#6366f1" />
        <MetricCard label="Em uso"              value={emUso}       accent="#14b8a6" />
        <MetricCard label="Home office"         value={homeOffice}  accent="#8b5cf6" />
        <MetricCard label="Disponíveis"         value={disponiveis} accent="#f59e0b" />
        <MetricCard label="Pendentes devolução" value={pendentes}   accent="#ef4444" />

        <div style={{
          flex: '1.6 1 240px',
          background: 'rgba(241,245,249,0.7)',
          border: '1px solid rgba(226,232,240,0.5)',
          borderRadius: 20, padding: 6,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.85) inset',
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 15,
            padding: '18px 20px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#14b8a6', opacity: 0.9 }} />
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#94a3b8',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#14b8a6', flexShrink: 0 }} />
              {filterTipo ? `Valor — ${filterTipo}` : 'Valor total do inventário'}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginTop: 14 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f766e', lineHeight: 1, letterSpacing: '-0.02em' }}>{valorFormatado}</div>
              <select
                value={filterTipo}
                onChange={e => setFilterTipo(e.target.value)}
                style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, background: '#f8fafc', color: '#475569', maxWidth: 96, flexShrink: 0, outline: 'none' }}
              >
                <option value="">Todos</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {pendentes > 0 && (
        <div style={{
          background: 'rgba(254,242,242,0.8)',
          border: '1px solid rgba(254,202,202,0.7)',
          borderRadius: 16, padding: '14px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 15, color: '#ef4444' }} />
          </div>
          <div>
            <strong style={{ color: '#dc2626', fontSize: 13, fontWeight: 700 }}>
              {pendentes} equipamento{pendentes > 1 ? 's' : ''} com devolução pendente
            </strong>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {filtrados.filter(e => e.status === 'Pendente devolução').map(e => (
                <span key={e.id} style={{
                  background: '#fee2e2', color: '#ef4444', borderRadius: 999,
                  padding: '3px 10px', fontSize: 11, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />
                  {e.id} — {e.descricao}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(241,245,249,0.7)',
        border: '1px solid rgba(226,232,240,0.5)',
        borderRadius: 20, padding: 6,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.85) inset',
      }}>
        <div style={{ background: '#ffffff', borderRadius: 15, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(226,232,240,0.5)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #818cf8)', display: 'inline-block', flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>Últimas movimentações</h2>
          </div>
          {movimentacoes.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.3 }}>○</div>
              Nenhuma movimentação registrada.
            </div>
          ) : (
            <div>
              {movimentacoes.slice(0, 10).map((m, i) => (
                <div key={m.id} className="table-row" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 20px',
                  borderBottom: i < Math.min(movimentacoes.length, 10) - 1 ? '1px solid rgba(241,245,249,0.9)' : 'none',
                }}>
                  {m.colaborador && <Avatar nome={(m.colaborador as any).nome ?? '?'} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
                      {(m.equipamento as any)?.id} — {(m.equipamento as any)?.descricao}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{m.acao}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 500 }}>{m.data}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
