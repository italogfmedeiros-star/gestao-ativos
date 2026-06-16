import type { Equipamento, Colaborador } from '../types'

function downloadCsv(filename: string, rows: string[][]) {
  const bom = '﻿'
  const csv = bom + rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function openPrintWindow(title: string, tableHtml: string) {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
      h2 { font-size: 18px; margin-bottom: 4px; }
      p.meta { font-size: 12px; color: #666; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th { background: #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.4px; }
      th, td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
      tr:nth-child(even) td { background: #f8fafc; }
      @media print { body { padding: 0; } }
    </style>
  </head><body>
    <h2>${title}</h2>
    <p class="meta">Exportado em ${new Date().toLocaleString('pt-BR')}</p>
    ${tableHtml}
    <script>window.onload = () => { window.print(); }<\/script>
  </body></html>`)
  win.document.close()
}

// ── Equipamentos ──────────────────────────────────────────────────────────────

export function exportEquipamentosCsv(items: Equipamento[]) {
  const header = ['Código', 'Descrição', 'Tipo', 'Status', 'Colaborador', 'Alugado', 'Valor']
  const rows = items.map(e => [
    e.id,
    e.descricao,
    e.tipo ?? '',
    e.status,
    (e.colaborador as any)?.nome ?? '',
    e.alugado ? 'Sim' : 'Não',
    e.valor != null ? e.valor.toFixed(2).replace('.', ',') : '',
  ])
  downloadCsv(`equipamentos_${dateTag()}.csv`, [header, ...rows])
}

export function exportEquipamentosPdf(items: Equipamento[]) {
  const thead = `<tr>${['Código','Descrição','Tipo','Status','Colaborador','Alugado','Valor'].map(h => `<th>${h}</th>`).join('')}</tr>`
  const tbody = items.map(e => `<tr>
    <td>${e.id}</td>
    <td>${e.descricao}${e.alugado ? ' <em>(alugado)</em>' : ''}</td>
    <td>${e.tipo ?? '—'}</td>
    <td>${e.status}</td>
    <td>${(e.colaborador as any)?.nome ?? '—'}</td>
    <td>${e.alugado ? 'Sim' : 'Não'}</td>
    <td>${e.valor != null ? e.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}</td>
  </tr>`).join('')
  openPrintWindow('Relatório de Equipamentos', `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`)
}

// ── Colaboradores ─────────────────────────────────────────────────────────────

export function exportColaboradoresCsv(items: Colaborador[], equipamentos: { colaborador_id: number | null }[]) {
  const header = ['Nome', 'E-mail', 'Setor', 'Regime', 'Status', 'Equipamentos']
  const rows = items.map(c => [
    c.nome,
    c.email ?? '',
    c.setor ?? '',
    c.regime,
    c.status,
    String(equipamentos.filter(e => e.colaborador_id === c.id).length),
  ])
  downloadCsv(`colaboradores_${dateTag()}.csv`, [header, ...rows])
}

export function exportColaboradoresPdf(items: Colaborador[], equipamentos: { colaborador_id: number | null }[]) {
  const thead = `<tr>${['Nome','E-mail','Setor','Regime','Status','Equip.'].map(h => `<th>${h}</th>`).join('')}</tr>`
  const tbody = items.map(c => `<tr>
    <td>${c.nome}</td>
    <td>${c.email ?? '—'}</td>
    <td>${c.setor ?? '—'}</td>
    <td>${c.regime}</td>
    <td>${c.status}</td>
    <td>${equipamentos.filter(e => e.colaborador_id === c.id).length}</td>
  </tr>`).join('')
  openPrintWindow('Relatório de Colaboradores', `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`)
}

function dateTag() {
  return new Date().toISOString().slice(0, 10)
}
