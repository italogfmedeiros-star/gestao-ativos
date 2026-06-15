import { useState } from 'react'
import { Avatar } from '../components/ui'
import type { Equipamento, Movimentacao, TipoEquipamento } from '../types'

interface Props {
  equipamentos: Equipamento[]
  movimentacoes: Movimentacao[]
}

function MetricCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, wordBreak: 'break-word' }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
    </div>
  )
}

const TIPOS: TipoEquipamento[] = ['Computador', 'Notebook', 'Monitor', 'Teclado', 'Mouse', 'Headset', 'Periférico', 'Impressora', 'Cadeira', 'Outros']

export function Dashboard({ equipamentos, movimentacoes }: Props) {
  const [filterTipo, setFilterTipo] = useState('')

  const ativos = equipamentos.filter(e => e.status !== 'Baixado')
  const filtrados = filterTipo ? ativos.filter(e => e.tipo === filterTipo) : ativos

  const total = ativos.length
  const emUso = ativos.filter(e => e.status === 'Em uso').length
  const homeOffice = ativos.filter(e => e.status === 'Home office').length
  const disponiveis = ativos.filter(e => e.status === 'Disponível').length
  const pendentes = ativos.filter(e => e.status === 'Pendente devolução').length
  const valorTotal = filtrados.reduce((acc, e) => acc + (e.valor ?? 0), 0)
  const valorFormatado = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 800, color: '#111' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
        <MetricCard label="Total de equipamentos" value={total} color="#111" />
        <MetricCard label="Em uso" value={emUso} color="#1d4ed8" />
        <MetricCard label="Home office" value={homeOffice} color="#7c3aed" />
        <MetricCard label="Disponíveis" value={disponiveis} color="#15803d" />
        <MetricCard label="Pendentes devolução" value={pendentes} color="#b91c1c" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <select
            value={filterTipo}
            onChange={e => setFilterTipo(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff' }}
          >
            <option value="">Todos os tipos</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '14px 20px',
            border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0d9488' }}>{valorFormatado}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              {filterTipo ? `Valor total — ${filterTipo}` : 'Valor total'}
            </div>
          </div>
        </div>
      </div>

      {pendentes > 0 && (
        <div style={{
          background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 10,
          padding: '14px 18px', marginBottom: 24,
        }}>
          <strong style={{ color: '#b91c1c', fontSize: 14 }}>
            ⚠ {pendentes} equipamento{pendentes > 1 ? 's' : ''} com devolução pendente
          </strong>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {equipamentos.filter(e => e.status === 'Pendente devolução').map(e => (
              <span key={e.id} style={{
                background: '#fee2e2', color: '#b91c1c', borderRadius: 6,
                padding: '3px 10px', fontSize: 12, fontWeight: 600,
              }}>
                {e.id} — {e.descricao}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111' }}>Últimas movimentações</h2>
        </div>
        {movimentacoes.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Nenhuma movimentação registrada.</div>
        ) : (
          <div>
            {movimentacoes.slice(0, 10).map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px', borderBottom: '1px solid #fafafa',
              }}>
                {m.colaborador && <Avatar nome={(m.colaborador as any).nome ?? '?'} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                    {(m.equipamento as any)?.id} — {(m.equipamento as any)?.descricao}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{m.acao}</div>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{m.data}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
