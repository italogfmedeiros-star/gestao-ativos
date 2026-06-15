import { useState, useEffect } from 'react'
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
  const [page, setPage] = useState<Page>(() => (localStorage.getItem('page') as Page) ?? 'dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const navigate = (p: Page) => {
    setPage(p)
    localStorage.setItem('page', p)
    setMenuOpen(false)
  }

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
    </div>
  )

  const sidebar = (
    <aside style={{
      width: 220, background: '#fff', borderRight: '1px solid #f0f0f0',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      ...(isMobile ? {
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200,
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: menuOpen ? '4px 0 24px rgba(0,0,0,0.15)' : 'none',
      } : {}),
    }}>
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>Dermaflora</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Gestão de Ativos TI</div>
        </div>
        {isMobile && (
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', padding: 4 }}
          >×</button>
        )}
      </div>
      <nav style={{ flex: 1, padding: '4px 8px' }}>
        {NAV.map(({ id, label, icon }) => {
          const active = page === id
          const showBadge = id === 'equipamentos' && pendentes > 0
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: active ? '#eff6ff' : 'transparent',
                color: active ? '#2563eb' : '#374151',
                border: 'none', cursor: 'pointer', fontSize: 14,
                fontWeight: active ? 600 : 400, marginBottom: 2, textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
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
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8f9fa', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {!isMobile && sidebar}

      {isMobile && (
        <>
          {sidebar}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                zIndex: 199,
              }}
            />
          )}
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isMobile && (
          <header style={{
            height: 52, background: '#fff', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
            flexShrink: 0,
          }}>
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 6, display: 'flex', flexDirection: 'column', gap: 5,
              }}
            >
              <span style={{ display: 'block', width: 22, height: 2, background: '#374151', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#374151', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#374151', borderRadius: 2 }} />
            </button>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>Dermaflora</div>
            {pendentes > 0 && <div style={{ marginLeft: 'auto' }}><BadgeCount count={pendentes} /></div>}
          </header>
        )}

        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? '20px 16px' : '32px 40px' }}>
          {page === 'dashboard' && (
            <Dashboard equipamentos={store.equipamentos} movimentacoes={store.movimentacoes} />
          )}
          {page === 'equipamentos' && (
            <Equipamentos
              equipamentos={store.equipamentos}
              colaboradores={store.colaboradores}
              onSave={store.saveEquipamento}
              onDelete={store.deleteEquipamento}
              onBaixar={store.baixarEquipamento}
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
    </div>
  )
}
