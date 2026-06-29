import React from 'react'
import type { StatusEquipamento, StatusColaborador } from '../types'

const statusColors: Record<StatusEquipamento, { bg: string; color: string }> = {
  'Em uso':             { bg: '#eef2ff', color: '#6366f1' },
  'Home office':        { bg: '#f5f3ff', color: '#8b5cf6' },
  'Disponível':         { bg: '#f0fdf4', color: '#16a34a' },
  'Pendente devolução': { bg: '#fef2f2', color: '#ef4444' },
  'Baixado':            { bg: '#f1f5f9', color: '#94a3b8' },
}

export function BadgeStatus({ status }: { status: StatusEquipamento }) {
  const s = statusColors[status]
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      letterSpacing: '0.02em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, opacity: 0.7, flexShrink: 0 }} />
      {status}
    </span>
  )
}

export function BadgeColaborador({ status }: { status: StatusColaborador }) {
  const ativo = status === 'Ativo'
  return (
    <span style={{
      background: ativo ? '#f0fdf4' : '#f3f4f6',
      color: ativo ? '#15803d' : '#6b7280',
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ativo ? '#16a34a' : '#9ca3af', flexShrink: 0 }} />
      {status}
    </span>
  )
}

export function BadgeCount({ count }: { count: number }) {
  if (!count) return null
  return (
    <span style={{
      background: '#ef4444', color: '#fff',
      borderRadius: 999, fontSize: 10, fontWeight: 700,
      minWidth: 18, height: 18,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 5px', letterSpacing: '0.02em',
    }}>
      {count}
    </span>
  )
}

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export function Modal({ title, onClose, children, width = 520 }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
        animation: 'modalOverlayIn 250ms cubic-bezier(0.32, 0.72, 0, 1) both',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Outer shell */}
      <div style={{
        width: '100%', maxWidth: width,
        background: 'rgba(241,245,249,0.9)',
        border: '1px solid rgba(226,232,240,0.7)',
        borderRadius: 24,
        padding: 6,
        animation: 'modalIn 350ms cubic-bezier(0.32, 0.72, 0, 1) both',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.85) inset',
      }}>
        {/* Inner core */}
        <div style={{
          background: '#ffffff',
          borderRadius: 19,
          maxHeight: 'calc(90vh - 48px)',
          overflow: 'auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px 18px',
            borderBottom: '1px solid rgba(226,232,240,0.6)',
          }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#f1f5f9', border: 'none',
                cursor: 'pointer', color: '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, lineHeight: 1, flexShrink: 0,
                transition: 'background 200ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >×</button>
          </div>
          <div style={{ padding: '20px 24px 24px' }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

export function Field({ label, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        color: '#64748b', marginBottom: 6,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 10, fontSize: 14, outline: 'none',
  boxSizing: 'border-box', background: '#fff', color: '#0f172a',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  transition: 'border-color 200ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1)',
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={inputStyle} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select style={{ ...inputStyle, cursor: 'pointer' }} {...props} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} {...props} />
}

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Btn({ variant = 'primary', style, children, ...rest }: BtnProps) {
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      color: '#fff', border: 'none',
      boxShadow: '0 1px 2px rgba(99,102,241,0.3), 0 4px 12px rgba(99,102,241,0.15)',
      borderRadius: 999,
    },
    secondary: {
      background: '#ffffff', color: '#374151',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      borderRadius: 10,
    },
    danger: {
      background: '#fef2f2', color: '#ef4444',
      border: '1px solid #fecaca',
      boxShadow: '0 1px 2px rgba(239,68,68,0.06)',
      borderRadius: 10,
    },
  }
  return (
    <button
      className={`btn-${variant}`}
      style={{
        ...variants[variant],
        padding: '9px 18px', fontSize: 13,
        fontWeight: 600, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Avatar({ nome }: { nome: string }) {
  const initials = nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const hue = nome.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: '50%',
      background: `hsl(${hue}, 50%, 90%)`,
      color: `hsl(${hue}, 50%, 35%)`,
      fontSize: 11, fontWeight: 700, flexShrink: 0,
      border: `1.5px solid hsl(${hue}, 50%, 82%)`,
    }}>
      {initials}
    </span>
  )
}

interface PaginationProps {
  total: number
  pageSize: number
  page: number
  onPageSize: (n: number) => void
  onPage: (n: number) => void
}

export function Pagination({ total, pageSize, page, onPageSize, onPage }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginTop: 16, flexWrap: 'wrap', gap: 8, padding: '4px 2px',
    }}>
      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
        {total === 0 ? '0 resultados' : `${start}–${end} de ${total}`}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: '#94a3b8', marginRight: 2 }}>Exibir</span>
        {[10, 20, 30].map(n => (
          <button
            key={n}
            onClick={() => { onPageSize(n); onPage(1) }}
            style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1px solid #e2e8f0',
              background: pageSize === n ? '#6366f1' : '#ffffff',
              color: pageSize === n ? '#fff' : '#64748b',
              transition: 'all 200ms cubic-bezier(0.32, 0.72, 0, 1)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >{n}</button>
        ))}
        <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
          <button
            onClick={() => onPage(page - 1)} disabled={page <= 1}
            style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: page <= 1 ? 'default' : 'pointer', border: '1px solid #e2e8f0',
              background: '#ffffff', color: page <= 1 ? '#d1d5db' : '#374151',
              transition: 'all 200ms cubic-bezier(0.32, 0.72, 0, 1)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >‹</button>
          <span style={{ padding: '4px 10px', fontSize: 12, color: '#64748b', alignSelf: 'center', fontWeight: 500 }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPage(page + 1)} disabled={page >= totalPages}
            style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: page >= totalPages ? 'default' : 'pointer', border: '1px solid #e2e8f0',
              background: '#ffffff', color: page >= totalPages ? '#d1d5db' : '#374151',
              transition: 'all 200ms cubic-bezier(0.32, 0.72, 0, 1)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >›</button>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', color: '#94a3b8', fontSize: 14 }}>
      <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.3 }}>○</div>
      {text}
    </div>
  )
}
