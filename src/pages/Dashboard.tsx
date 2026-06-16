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
  iconBg: string
  icon: string
  flexBasis?: string
}

function MetricCard({ label, value, accent, iconBg, icon, flexBasis = '1 1 150px' }: MetricCardProps) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '16px 18px',
      border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden',
      flex: flexBasis,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
      <div style={{
        width: 34, height: 34, borderRadius: 8, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
      }}>
        <i className={icon} aria-hidden="true" style={{ fontSize: 18, color: accent }} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

const TIPOS: TipoEquipamento[] = ['Computador', 'Notebook', 'Monitor', 'Teclado', 'Mouse', 'Headset', 'Periférico', 'Impressora', 'Smartphone', 'Outros']

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
        <MetricCard label={filterTipo ? `Total — ${filterTipo}` : 'Total de equipamentos'} value={total} accent="#6366f1" iconBg="#eef2ff" icon="ti ti-devices" />
        <MetricCard label="Em uso"                value={emUso}       accent="#14b8a6" iconBg="#f0fdfa" icon="ti ti-check" />
        <MetricCard label="Home office"           value={homeOffice}  accent="#8b5cf6" iconBg="#f5f3ff" icon="ti ti-home" />
        <MetricCard label="Disponíveis"           value={disponiveis} accent="#f59e0b" iconBg="#fffbeb" icon="ti ti-package" />
        <MetricCard label="Pendentes devolução"   value={pendentes}   accent="#ef4444" iconBg="#fef2f2" icon="ti ti-alert-circle" />

        <div style={{
          flex: '1.6 1 240px',
          background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #e2e8f0',
          position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#14b8a6' }} />
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {filterTipo ? `Valor — ${filterTipo}` : 'Valor total do inventário'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f766e', lineHeight: 1 }}>{valorFormatado}</div>
            <select
              value={filterTipo}
              onChange={e => setFilterTipo(e.target.value)}
              style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, background: '#f8fafc', color: '#475569', maxWidth: 96, flexShrink: 0 }}
            >
              <option value="">Todos</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {pendentes > 0 && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
          padding: '14px 18px', marginBottom: 24,
        }}>
          <strong style={{ color: '#dc2626', fontSize: 14 }}>
            ⚠ {pendentes} equipamento{pendentes > 1 ? 's' : ''} com devolução pendente
          </strong>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {filtrados.filter(e => e.status === 'Pendente devolução').map(e => (
              <span key={e.id} style={{
                background: '#fee2e2', color: '#ef4444', borderRadius: 6,
                padding: '3px 10px', fontSize: 12, fontWeight: 600,
              }}>
                {e.id} — {e.descricao}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: '#6366f1', display: 'inline-block' }} />
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Últimas movimentações</h2>
        </div>
        {movimentacoes.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Nenhuma movimentação registrada.</div>
        ) : (
          <div>
            {movimentacoes.slice(0, 10).map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px', borderBottom: '1px solid #f8fafc',
              }}>
                {m.colaborador && <Avatar nome={(m.colaborador as any).nome ?? '?'} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                    {(m.equipamento as any)?.id} — {(m.equipamento as any)?.descricao}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{m.acao}</div>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{m.data}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
