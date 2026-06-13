import React from 'react'
import type { StatusEquipamento, StatusColaborador } from '../types'

const statusColors: Record<StatusEquipamento, { bg: string; color: string }> = {
  'Em uso':             { bg: '#dbeafe', color: '#1d4ed8' },
  'Home office':        { bg: '#ede9fe', color: '#7c3aed' },
  'Disponível':         { bg: '#dcfce7', color: '#15803d' },
  'Pendente devolução': { bg: '#fee2e2', color: '#b91c1c' },
}

export function BadgeStatus({ status }: { status: StatusEquipamento }) {
  const s = statusColors[status]
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
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
    primary:   { background: '#2563eb', color: '#fff', border: 'none' },
    secondary: { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' },
    danger:    { background: '#fee2e2', color: '#b91c1c', border: 'none' },
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

export function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af', fontSize: 14 }}>
      {text}
    </div>
  )
}
