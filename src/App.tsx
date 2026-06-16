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
  const currentLabel = NAV.find(n => n.id === page)?.label ?? ''

  if (store.loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b', fontSize: 15, background: '#f1f5f9' }}>
      Carregando...
    </div>
  )

  if (store.error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#b91c1c', gap: 8, background: '#f1f5f9' }}>
      <strong>Erro ao conectar ao banco</strong>
      <span style={{ fontSize: 13, color: '#64748b' }}>{store.error}</span>
    </div>
  )

  const sidebar = (
    <aside style={{
      width: 220, background: '#0f172a', display: 'flex', flexDirection: 'column',
      flexShrink: 0, position: 'relative', overflow: 'hidden',
      ...(isMobile ? {
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200,
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: menuOpen ? '4px 0 32px rgba(0,0,0,0.3)' : 'none',
      } : {}),
    }}>
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -70, left: -70, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(20,184,166,0.08)', bottom: 60, right: -55, pointerEvents: 'none' }} />

      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #14b8a6)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.2px' }}>Dermaflora</span>
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 3, letterSpacing: '0.4px', textTransform: 'uppercase', paddingLeft: 16 }}>Gestão de Ativos TI</div>
        </div>
        {isMobile && (
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b', padding: 4 }}>×</button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '4px 10px', position: 'relative', zIndex: 1 }}>
        {NAV.map(({ id, label, icon }) => {
          const active = page === id
          const showBadge = id === 'equipamentos' && pendentes > 0
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 12px', borderRadius: 8,
                background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                color: active ? '#e2e8f0' : '#94a3b8',
                cursor: 'pointer', fontSize: 13,
                fontWeight: active ? 600 : 400, marginBottom: 2, textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.7 }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {showBadge && <BadgeCount count={pendentes} />}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#334155', position: 'relative', zIndex: 1 }}>
        v1.0.0
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {!isMobile && sidebar}

      {isMobile && (
        <>
          {sidebar}
          {menuOpen && (
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />
          )}
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isMobile ? (
          <header style={{
            height: 52, background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0,
          }}>
            <button
              onClick={() => setMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}
            >
              <span style={{ display: 'block', width: 22, height: 2, background: '#94a3b8', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#94a3b8', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#94a3b8', borderRadius: 2 }} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Dermaflora</span>
            {pendentes > 0 && <div style={{ marginLeft: 'auto' }}><BadgeCount count={pendentes} /></div>}
          </header>
        ) : (
          <header style={{
            height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', padding: '0 32px',
            justifyContent: 'space-between', flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{currentLabel}</span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.5px',
            }}>DF</div>
          </header>
        )}

        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? '20px 16px' : '28px 32px' }}>
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
