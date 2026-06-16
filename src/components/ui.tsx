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
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 110, maxWidth: 130, textAlign: 'center',
    }}>
      {status}
    </span>
  )
}

export function BadgeColaborador({ status }: { status: StatusColaborador }) {
  const ativo = status === 'Ativo'
  return (
    <span style={{
      background: ativo ? '#dcfce7' : '#f3f4f6',
      color: ativo ? '#15803d' : '#6b7280',
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600,
    }}>
      {status}
    </span>
  )
}

export function BadgeCount({ count }: { count: number }) {
  if (!count) return null
  return (
    <span style={{
      background: '#ef4444', color: '#fff',
      borderRadius: '50%', fontSize: 11, fontWeight: 700,
      minWidth: 18, height: 18,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 4px',
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
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 12,
        width: '100%', maxWidth: width, maxHeight: '90vh',
        overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0',
        }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', fontSize: 22,
              cursor: 'pointer', color: '#999', lineHeight: 1, padding: '0 4px',
            }}
          >×</button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
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
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid #ddd',
  borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  background: '#fff', color: '#111',
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
  const variants = {
    primary:   { background: '#6366f1', color: '#fff', border: 'none' },
    secondary: { background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0' },
    danger:    { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
  }
  return (
    <button
      style={{
        ...variants[variant],
        padding: '9px 18px', borderRadius: 8, fontSize: 14,
        fontWeight: 600, cursor: 'pointer', ...style,
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
      background: `hsl(${hue}, 55%, 88%)`, color: `hsl(${hue}, 55%, 35%)`,
      fontSize: 12, fontWeight: 700, flexShrink: 0,
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#9ca3af' }}>
        {total === 0 ? '0 resultados' : `${start}–${end} de ${total}`}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Exibir</span>
        {[10, 20, 30].map(n => (
          <button
            key={n}
            onClick={() => { onPageSize(n); onPage(1) }}
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1px solid #e5e7eb',
              background: pageSize === n ? '#2563eb' : '#f3f4f6',
              color: pageSize === n ? '#fff' : '#374151',
            }}
          >{n}</button>
        ))}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          <button
            onClick={() => onPage(page - 1)} disabled={page <= 1}
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              cursor: page <= 1 ? 'default' : 'pointer', border: '1px solid #e5e7eb',
              background: '#f3f4f6', color: page <= 1 ? '#d1d5db' : '#374151',
            }}
          >‹</button>
          <span style={{ padding: '4px 8px', fontSize: 12, color: '#6b7280', alignSelf: 'center' }}>
            {page}/{totalPages}
          </span>
          <button
            onClick={() => onPage(page + 1)} disabled={page >= totalPages}
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              cursor: page >= totalPages ? 'default' : 'pointer', border: '1px solid #e5e7eb',
              background: '#f3f4f6', color: page >= totalPages ? '#d1d5db' : '#374151',
            }}
          >›</button>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af', fontSize: 14 }}>
      {text}
    </div>
  )
}
