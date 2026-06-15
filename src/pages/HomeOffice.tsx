import { useMemo, useState } from 'react'
import { BadgeStatus, Avatar, EmptyState, Pagination } from '../components/ui'
import type { Colaborador, Equipamento } from '../types'

interface Props {
  colaboradores: Colaborador[]
  equipamentos: Equipamento[]
}

export function HomeOffice({ colaboradores, equipamentos }: Props) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const hoEquips = useMemo(() =>
    equipamentos.filter(e => e.status === 'Home office'),
    [equipamentos]
  )

  const porColaborador = useMemo(() => {
    const map = new Map<number, { colaborador: Colaborador; equips: Equipamento[] }>()
    for (const eq of hoEquips) {
      if (!eq.colaborador_id) continue
      const col = colaboradores.find(c => c.id === eq.colaborador_id)
      if (!col) continue
      if (!map.has(col.id)) map.set(col.id, { colaborador: col, equips: [] })
      map.get(col.id)!.equips.push(eq)
    }
    return Array.from(map.values()).sort((a, b) => a.colaborador.nome.localeCompare(b.colaborador.nome))
  }, [hoEquips, colaboradores])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return porColaborador.slice(start, start + pageSize)
  }, [porColaborador, page, pageSize])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#111' }}>Home Office</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          {hoEquips.length} equipamento{hoEquips.length !== 1 ? 's' : ''} em home office — {porColaborador.length} colaborador{porColaborador.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {porColaborador.length === 0 ? (
        <EmptyState text="Nenhum equipamento em home office." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paginated.map(({ colaborador, equips }) => (
            <div key={colaborador.id} style={{
              background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px', background: '#faf9ff', borderBottom: '1px solid #f0f0f0',
              }}>
                <Avatar nome={colaborador.nome} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{colaborador.nome}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{colaborador.setor ?? ''} — {colaborador.regime}</div>
                </div>
                <span style={{
                  marginLeft: 'auto', background: '#ede9fe', color: '#7c3aed',
                  borderRadius: 10, padding: '2px 10px', fontSize: 12, fontWeight: 700,
                }}>
                  {equips.length} equip.
                </span>
              </div>
              <div>
                {equips.map(eq => (
                  <div key={eq.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 20px', borderBottom: '1px solid #fafafa',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', width: 70 }}>{eq.id}</span>
                    <span style={{ flex: 1, fontSize: 13, color: '#374151' }}>{eq.descricao}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{eq.tipo ?? ''}</span>
                    {eq.observacao && (
                      <span style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {eq.observacao}
                      </span>
                    )}
                    <BadgeStatus status={eq.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination total={porColaborador.length} pageSize={pageSize} page={page} onPageSize={n => { setPageSize(n); setPage(1) }} onPage={setPage} />
    </div>
  )
}
