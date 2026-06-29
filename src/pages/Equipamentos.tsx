import { useState, useMemo } from 'react'
import { BadgeStatus, Btn, EmptyState, Pagination } from '../components/ui'
import { ModalEquipamento } from '../components/ModalEquipamento'
import { ModalBaixaEquipamento } from '../components/ModalBaixaEquipamento'
import { exportEquipamentosCsv, exportEquipamentosPdf } from '../lib/export'
import type { Equipamento, Colaborador, MotivoBaixa, StatusEquipamento, TipoEquipamento } from '../types'

interface Props {
  equipamentos: Equipamento[]
  colaboradores: Colaborador[]
  onSave: (data: Partial<Equipamento> & { id: string; descricao: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onBaixar: (equipamentoId: string, motivo: MotivoBaixa, observacao: string) => Promise<void>
}

export function Equipamentos({ equipamentos, colaboradores, onSave, onDelete, onBaixar }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [editing, setEditing] = useState<Equipamento | null | 'new'>(null)

  const nextId = useMemo(() => {
    const nums = equipamentos
      .map(e => parseInt(e.id.replace('DF-', ''), 10))
      .filter(n => !isNaN(n))
    const max = nums.length ? Math.max(...nums) : 0
    return `DF-${String(max + 1).padStart(3, '0')}`
  }, [equipamentos])
  const [baixando, setBaixando] = useState<Equipamento | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    return equipamentos.filter(e => {
      if (!filterStatus && e.status === 'Baixado') return false
      const q = search.toLowerCase()
      const matchSearch = !q || e.id.toLowerCase().includes(q) || e.descricao.toLowerCase().includes(q) ||
        (e.colaborador as any)?.nome?.toLowerCase().includes(q)
      const matchStatus = !filterStatus || e.status === filterStatus
      const matchTipo = !filterTipo || e.tipo === filterTipo
      return matchSearch && matchStatus && matchTipo
    })
  }, [equipamentos, search, filterStatus, filterTipo])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const handleDelete = async (id: string) => {
    if (!confirm(`Remover equipamento ${id}?`)) return
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Equipamentos</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" onClick={() => exportEquipamentosCsv(filtered)}>Exportar CSV</Btn>
          <Btn variant="secondary" onClick={() => exportEquipamentosPdf(filtered)}>Exportar PDF</Btn>
          <Btn onClick={() => setEditing('new')}>+ Novo equipamento</Btn>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código, descrição ou colaborador..."
          style={{
            flex: 1, minWidth: 200, padding: '9px 14px', border: '1px solid #e2e8f0',
            borderRadius: 10, fontSize: 14, outline: 'none', background: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        />
        <select
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
        >
          <option value="">Ativos (sem baixados)</option>
          {(['Em uso', 'Home office', 'Disponível', 'Pendente devolução', 'Baixado'] as StatusEquipamento[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
        >
          <option value="">Todos os tipos</option>
          {(['All in one', 'Computador', 'Notebook', 'Monitor', 'Teclado', 'Mouse', 'Headset', 'Periférico', 'Impressora', 'Smartphone', 'Outros'] as TipoEquipamento[]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <Btn variant="secondary" onClick={() => { setSearch(''); setFilterStatus(''); setFilterTipo('') }}>
          Limpar
        </Btn>
      </div>

      <div style={{ background: 'rgba(241,245,249,0.7)', border: '1px solid rgba(226,232,240,0.5)', borderRadius: 20, padding: 6, boxShadow: '0 0 0 1px rgba(255,255,255,0.85) inset' }}>
        <div style={{ minWidth: 700, background: '#ffffff', borderRadius: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px minmax(120px,1fr) 110px 165px 160px 100px 120px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(0deg, #f8fafc, #ffffff)' }}>
          {['Código', 'Descrição', 'Tipo', 'Status', 'Colaborador', 'Valor', 'Ações'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyState text="Nenhum equipamento encontrado." />
        ) : (
          paginated.map(eq => (
            <div key={eq.id} className="table-row" style={{
              display: 'grid', gridTemplateColumns: '90px minmax(120px,1fr) 110px 165px 160px 100px 120px',
              padding: '14px 16px', borderBottom: '1px solid rgba(241,245,249,0.8)', alignItems: 'center',
              opacity: eq.status === 'Baixado' ? 0.6 : 1,
            }}>
              <span
                onClick={() => setEditing(eq)}
                style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', cursor: 'pointer' }}
              >{eq.id}</span>
              <span style={{ fontSize: 13, color: '#111' }}>
                {eq.descricao}
                {eq.alugado && <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>(alugado)</span>}
              </span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{eq.tipo ?? '—'}</span>
              <BadgeStatus status={eq.status} />
              <span style={{ fontSize: 13, color: '#374151' }}>
                {(eq.colaborador as any)?.nome ?? <span style={{ color: '#9ca3af' }}>—</span>}
              </span>
              <span style={{ fontSize: 13, color: '#374151' }}>
                {eq.valor != null
                  ? eq.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : <span style={{ color: '#9ca3af' }}>—</span>}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {eq.status !== 'Baixado' && (
                  <>
                    <Btn variant="secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setEditing(eq)}>
                      Editar
                    </Btn>
                    <Btn variant="danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setBaixando(eq)}>
                      Baixar
                    </Btn>
                  </>
                )}
                {eq.status === 'Baixado' && (
                  <Btn variant="danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleDelete(eq.id)} disabled={deleting === eq.id}>
                    ×
                  </Btn>
                )}
              </div>
            </div>
          ))
        )}
        </div>
      </div>
      <Pagination total={filtered.length} pageSize={pageSize} page={page} onPageSize={n => { setPageSize(n); setPage(1) }} onPage={setPage} />

      {editing && (
        <ModalEquipamento
          equipamento={editing === 'new' ? null : editing}
          nextId={editing === 'new' ? nextId : undefined}
          colaboradores={colaboradores}
          onSave={onSave}
          onClose={() => setEditing(null)}
        />
      )}
      {baixando && (
        <ModalBaixaEquipamento
          equipamento={baixando}
          onConfirm={(motivo, obs) => onBaixar(baixando.id, motivo, obs)}
          onClose={() => setBaixando(null)}
        />
      )}
    </div>
  )
}
