import { useState, useMemo } from 'react'
import { Avatar, EmptyState, Btn, Pagination } from '../components/ui'
import type { Movimentacao } from '../types'

interface Props {
  movimentacoes: Movimentacao[]
}

export function Movimentacoes({ movimentacoes }: Props) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return movimentacoes
    return movimentacoes.filter(m =>
      m.equipamento_id.toLowerCase().includes(q) ||
      m.acao.toLowerCase().includes(q) ||
      ((m.colaborador as any)?.nome ?? '').toLowerCase().includes(q) ||
      ((m.equipamento as any)?.descricao ?? '').toLowerCase().includes(q)
    )
  }, [movimentacoes, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Movimentações</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>{movimentacoes.length} registros</span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por equipamento, ação ou colaborador..."
          style={{
            flex: 1, padding: '9px 14px', border: '1px solid #e2e8f0',
            borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
            background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        />
        <Btn variant="secondary" onClick={() => setSearch('')}>Limpar</Btn>
      </div>

      <div style={{ background: 'rgba(241,245,249,0.7)', border: '1px solid rgba(226,232,240,0.5)', borderRadius: 20, padding: 6, boxShadow: '0 0 0 1px rgba(255,255,255,0.85) inset' }}>
        <div style={{ minWidth: 620, background: '#ffffff', borderRadius: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 130px 1fr 150px 110px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(0deg, #f8fafc, #ffffff)' }}>
          {['Data', 'Equipamento', 'Ação', 'Colaborador', 'Responsável'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyState text="Nenhuma movimentação encontrada." />
        ) : (
          paginated.map(m => (
            <div key={m.id} className="table-row" style={{
              display: 'grid', gridTemplateColumns: '100px 130px 1fr 150px 110px',
              padding: '14px 16px', borderBottom: '1px solid rgba(241,245,249,0.8)', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{m.data}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>{m.equipamento_id}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{(m.equipamento as any)?.descricao ?? ''}</div>
              </div>
              <span style={{ fontSize: 13, color: '#374151' }}>{m.acao}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {m.colaborador && <Avatar nome={(m.colaborador as any).nome} />}
                <span style={{ fontSize: 13, color: '#374151' }}>{(m.colaborador as any)?.nome ?? '—'}</span>
              </div>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{m.responsavel ?? '—'}</span>
            </div>
          ))
        )}
        </div>
      </div>
      <Pagination total={filtered.length} pageSize={pageSize} page={page} onPageSize={n => { setPageSize(n); setPage(1) }} onPage={setPage} />
    </div>
  )
}
