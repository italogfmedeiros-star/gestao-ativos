import { useState, useMemo } from 'react'
import { Avatar, Btn, EmptyState, Pagination } from '../components/ui'
import { ModalColaborador } from '../components/ModalColaborador'
import { ModalDesligamento } from '../components/ModalDesligamento'
import { ModalColaboradorDetalhe } from '../components/ModalColaboradorDetalhe'
import type { Colaborador, Equipamento } from '../types'

interface Props {
  colaboradores: Colaborador[]
  equipamentos: Equipamento[]
  onSave: (data: Partial<Colaborador> & { nome: string }) => Promise<void>
  onDesligar: (id: number, devolvidos: string[], responsavel: string) => Promise<void>
}

export function Colaboradores({ colaboradores, equipamentos, onSave, onDesligar }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Ativo')
  const [editing, setEditing] = useState<Colaborador | null | 'new'>(null)
  const [desligando, setDesligando] = useState<Colaborador | null>(null)
  const [detalhe, setDetalhe] = useState<Colaborador | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    return colaboradores.filter(c => {
      const q = search.toLowerCase()
      const matchSearch = !q || c.nome.toLowerCase().includes(q) || (c.setor ?? '').toLowerCase().includes(q)
      const matchStatus = !filterStatus || c.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [colaboradores, search, filterStatus])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const equipamentosDoColaborador = (id: number) => equipamentos.filter(e => e.colaborador_id === id)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Colaboradores</h1>
        <Btn onClick={() => setEditing('new')}>+ Novo colaborador</Btn>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou setor..."
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none' }}
        />
        <select
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
        >
          <option value="">Todos</option>
          <option value="Ativo">Ativos</option>
          <option value="Desligado">Desligados</option>
        </select>
        <Btn variant="secondary" onClick={() => { setSearch(''); setFilterStatus('') }}>
          Limpar
        </Btn>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', overflowX: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ minWidth: 580 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 130px 120px 60px 130px', padding: '10px 16px', borderBottom: '1px solid #f0f0f0', background: '#f9fafb' }}>
          {['', 'Nome', 'Setor', 'Regime', 'Equip.', 'Ações'].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyState text="Nenhum colaborador encontrado." />
        ) : (
          paginated.map(col => {
            const equips = equipamentosDoColaborador(col.id)
            return (
              <div key={col.id} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 130px 120px 60px 130px',
                padding: '12px 16px', borderBottom: '1px solid #fafafa', alignItems: 'center',
              }}>
                <Avatar nome={col.nome} />
                <div
                  onClick={() => setDetalhe(col)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2563eb' }}>{col.nome}</div>
                  {col.email && <div style={{ fontSize: 12, color: '#9ca3af' }}>{col.email}</div>}
                </div>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{col.setor ?? '—'}</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{col.regime}</span>
                <span
                  onClick={() => setDetalhe(col)}
                  style={{ fontSize: 13, fontWeight: 600, color: equips.length ? '#2563eb' : '#9ca3af', cursor: equips.length ? 'pointer' : 'default' }}
                >
                  {equips.length}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setEditing(col)}>
                    Editar
                  </Btn>
                  {col.status === 'Ativo' && (
                    <Btn variant="danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setDesligando(col)}>
                      Desligar
                    </Btn>
                  )}
                </div>
              </div>
            )
          })
        )}
        </div>
      </div>
      <Pagination total={filtered.length} pageSize={pageSize} page={page} onPageSize={n => { setPageSize(n); setPage(1) }} onPage={setPage} />

      {editing && (
        <ModalColaborador
          colaborador={editing === 'new' ? null : editing}
          onSave={onSave}
          onClose={() => setEditing(null)}
        />
      )}
      {desligando && (
        <ModalDesligamento
          colaborador={desligando}
          equipamentos={equipamentosDoColaborador(desligando.id)}
          onConfirm={(devolvidos, responsavel) => onDesligar(desligando.id, devolvidos, responsavel)}
          onClose={() => setDesligando(null)}
        />
      )}
      {detalhe && (
        <ModalColaboradorDetalhe
          colaborador={detalhe}
          equipamentos={equipamentosDoColaborador(detalhe.id)}
          onClose={() => setDetalhe(null)}
        />
      )}
    </div>
  )
}
