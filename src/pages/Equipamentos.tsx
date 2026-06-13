import { useState, useMemo } from 'react'
import { BadgeStatus, Btn, EmptyState } from '../components/ui'
import { ModalEquipamento } from '../components/ModalEquipamento'
import type { Equipamento, Colaborador, StatusEquipamento, TipoEquipamento } from '../types'

interface Props {
  equipamentos: Equipamento[]
  colaboradores: Colaborador[]
  onSave: (data: Partial<Equipamento> & { id: string; descricao: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function Equipamentos({ equipamentos, colaboradores, onSave, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [editing, setEditing] = useState<Equipamento | null | 'new'>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return equipamentos.filter(e => {
      const q = search.toLowerCase()
      const matchSearch = !q || e.id.toLowerCase().includes(q) || e.descricao.toLowerCase().includes(q) ||
        (e.colaborador as any)?.nome?.toLowerCase().includes(q)
      const matchStatus = !filterStatus || e.status === filterStatus
      const matchTipo = !filterTipo || e.tipo === filterTipo
      return matchSearch && matchStatus && matchTipo
    })
  }, [equipamentos, search, filterStatus, filterTipo])

  const handleDelete = async (id: string) => {
    if (!confirm(`Remover equipamento ${id}?`)) return
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111' }}>Equipamentos</h1>
        <Btn onClick={() => setEditing('new')}>+ Novo equipamento</Btn>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código, descrição ou colaborador..."
          style={{
            flex: 1, minWidth: 200, padding: '8px 12px', border: '1px solid #ddd',
            borderRadius: 8, fontSize: 14, outline: 'none',
          }}
        />
        <select
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
        >
          <option value="">Todos os status</option>
          {(['Em uso', 'Home office', 'Disponível', 'Pendente devolução'] as StatusEquipamento[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
        >
          <option value="">Todos os tipos</option>
          {(['Computador', 'Notebook', 'Monitor', 'Teclado', 'Mouse', 'Headset', 'Periférico', 'Impressora', 'Cadeira', 'Outros'] as TipoEquipamento[]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <Btn variant="secondary" onClick={() => { setSearch(''); setFilterStatus(''); setFilterTipo('') }}>
          Limpar
        </Btn>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 140px 180px 90px', padding: '10px 16px', borderBottom: '1px solid #f0f0f0', background: '#f9fafb' }}>
          {['Código', 'Descrição', 'Tipo', 'Status', 'Colaborador', 'Ações'].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyState text="Nenhum equipamento encontrado." />
        ) : (
          filtered.map(eq => (
            <div key={eq.id} style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 100px 140px 180px 90px',
              padding: '12px 16px', borderBottom: '1px solid #fafafa', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{eq.id}</span>
              <span style={{ fontSize: 13, color: '#111' }}>
                {eq.descricao}
                {eq.alugado && <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>(alugado)</span>}
              </span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{eq.tipo ?? '—'}</span>
              <BadgeStatus status={eq.status} />
              <span style={{ fontSize: 13, color: '#374151' }}>
                {(eq.colaborador as any)?.nome ?? <span style={{ color: '#9ca3af' }}>—</span>}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <Btn variant="secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setEditing(eq)}>
                  Editar
                </Btn>
                <Btn variant="danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleDelete(eq.id)} disabled={deleting === eq.id}>
                  ×
                </Btn>
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#9ca3af' }}>{filtered.length} equipamento{filtered.length !== 1 ? 's' : ''}</div>

      {editing && (
        <ModalEquipamento
          equipamento={editing === 'new' ? null : editing}
          colaboradores={colaboradores}
          onSave={onSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
