import { useState } from 'react'
import { useStore } from './hooks/useStore'
import { Dashboard } from './pages/Dashboard'
import { Equipamentos } from './pages/Equipamentos'
import { Colaboradores } from './pages/Colaboradores'
import { HomeOffice } from './pages/HomeOffice'
import { Movimentacoes } from './pages/Movimentacoes'
import { BadgeCount } from './components/ui'

type Page = 'dashboard' | 'equipamentos' | 'colaboradores' | 'homeoffice' | 'movimentacoes'

const NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard',     label: 'Dashboard',     icon: '◉' },
  { id: 'equipamentos',  label: 'Equipamentos',  icon: '🖥' },
  { id: 'colaboradores', label: 'Colaboradores', icon: '👤' },
  { id: 'homeoffice',    label: 'Home Office',   icon: '🏠' },
  { id: 'movimentacoes', label: 'Movimentações', icon: '↕' },
]

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const store = useStore()
  const pendentes = store.equipamentos.filter(e => e.status === 'Pendente devolução').length

  if (store.loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b7280', fontSize: 15 }}>
      Carregando...
    </div>
  )

  if (store.error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#b91c1c', gap: 8 }}>
      <strong>Erro ao conectar ao banco</strong>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{store.error}</span>
      <span style={{ fontSize: 12, color: '#9ca3af' }}>Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8f9fa', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{
        width: 220, background: '#fff', borderRight: '1px solid #f0f0f0',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>Dermaflora</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Gestão de Ativos TI</div>
        </div>
        <nav style={{ flex: 1, padding: '4px 8px' }}>
          {NAV.map(({ id, label, icon }) => {
            const active = page === id
            const showBadge = id === 'equipamentos' && pendentes > 0
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: active ? '#eff6ff' : 'transparent',
                  color: active ? '#2563eb' : '#374151',
                  border: 'none', cursor: 'pointer', fontSize: 14,
                  fontWeight: active ? 600 : 400, marginBottom: 2, textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {showBadge && <BadgeCount count={pendentes} />}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0', fontSize: 12, color: '#9ca3af' }}>
          v1.0.0
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
        {page === 'dashboard' && (
          <Dashboard equipamentos={store.equipamentos} movimentacoes={store.movimentacoes} />
        )}
        {page === 'equipamentos' && (
          <Equipamentos
            equipamentos={store.equipamentos}
            colaboradores={store.colaboradores}
            onSave={store.saveEquipamento}
            onDelete={store.deleteEquipamento}
          />
        )}
        {page === 'colaboradores' && (
          <Colaboradores
            colaboradores={store.colaboradores}
            equipamentos={store.equipamentos}
            onSave={store.saveColaborador}
            onDesligar={store.desligarColaborador}
          />
        )}
        {page === 'homeoffice' && (
          <HomeOffice colaboradores={store.colaboradores} equipamentos={store.equipamentos} />
        )}
        {page === 'movimentacoes' && (
          <Movimentacoes movimentacoes={store.movimentacoes} />
        )}
      </main>
    </div>
  )
}
