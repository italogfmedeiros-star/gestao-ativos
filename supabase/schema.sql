-- ============================================================
-- Dermaflora Ativos — Schema completo + seed
-- Executar no SQL Editor do Supabase
-- ============================================================

-- Tabelas
create table if not exists colaboradores (
  id         serial primary key,
  nome       text not null,
  email      text,
  setor      text,
  regime     text check (regime in ('Presencial','Home office','Híbrido')),
  status     text check (status in ('Ativo','Desligado')) default 'Ativo',
  created_at timestamptz default now()
);

create table if not exists equipamentos (
  id             text primary key,
  descricao      text not null,
  tipo           text,
  setor          text,
  colaborador_id integer references colaboradores(id) on delete set null,
  status         text check (status in ('Em uso','Home office','Disponível','Pendente devolução')) default 'Disponível',
  alugado        boolean default false,
  observacao     text,
  created_at     timestamptz default now()
);

create table if not exists movimentacoes (
  id             serial primary key,
  data           text,
  equipamento_id text references equipamentos(id),
  acao           text,
  colaborador_id integer references colaboradores(id),
  responsavel    text,
  created_at     timestamptz default now()
);

-- ============================================================
-- SEED: Colaboradores
-- ============================================================
insert into colaboradores (id, nome, setor, regime, status) values
  (1,  'Victor',      'Home office', 'Home office', 'Ativo'),
  (2,  'Victoria',    'Home office', 'Home office', 'Ativo'),
  (3,  'Ana Paula',   'Home office', 'Home office', 'Ativo'),
  (4,  'Thamires RH', 'RH',          'Home office', 'Ativo'),
  (5,  'Crislani',    'Home office', 'Home office', 'Ativo'),
  (6,  'Monica',      'Home office', 'Home office', 'Ativo'),
  (7,  'Dayana',      'Home office', 'Home office', 'Ativo'),
  (8,  'Priscila',    'Home office', 'Home office', 'Ativo'),
  (9,  'Ivani',       'Home office', 'Home office', 'Ativo'),
  (10, 'Duda',        'Home office', 'Home office', 'Ativo'),
  (11, 'Julia',       'Home office', 'Home office', 'Ativo'),
  (12, 'Iago',        'Home office', 'Home office', 'Ativo'),
  (13, 'Italo',       'Home office', 'Home office', 'Ativo'),
  (14, 'Patrícia',    'Home office', 'Home office', 'Ativo'),
  (15, 'Gabriella',   'Home office', 'Home office', 'Ativo'),
  (16, 'Cecília',     'Home office', 'Home office', 'Ativo')
on conflict (id) do nothing;

-- Ajusta a sequence para continuar após o id 16
select setval('colaboradores_id_seq', 16);

-- ============================================================
-- SEED: Equipamentos
-- ============================================================
insert into equipamentos (id, descricao, tipo, setor, colaborador_id, status, alugado, observacao) values
  ('DF-001', 'All in One Positivo',   'Computador', 'Home office', 1,    'Home office',        false, null),
  ('DF-002', 'Kit Teclado e Mouse',   'Periférico', 'Home office', 1,    'Home office',        false, null),
  ('DF-003', 'All in One Positivo',   'Computador', 'Home office', 2,    'Home office',        false, null),
  ('DF-004', 'Monitor',               'Monitor',    'Home office', 2,    'Home office',        false, null),
  ('DF-005', 'All in One Arquimedes', 'Computador', 'Home office', 3,    'Home office',        false, null),
  ('DF-006', 'Monitor LG',            'Monitor',    'Home office', 3,    'Home office',        false, null),
  ('DF-007', 'Teclado',               'Teclado',    'Home office', 3,    'Home office',        false, null),
  ('DF-008', 'Mouse',                 'Mouse',      'Home office', 3,    'Home office',        false, null),
  ('DF-009', 'Headset',               'Headset',    'Home office', 3,    'Home office',        false, null),
  ('DF-010', 'Cadeira',               'Cadeira',    'Home office', 3,    'Home office',        false, null),
  ('DF-011', 'Notebook Lenovo',       'Notebook',   'Home office', 4,    'Home office',        false, 'Transferido de Patrícia'),
  ('DF-012', 'All in One Positivo',   'Computador', 'Home office', 5,    'Home office',        false, null),
  ('DF-013', 'Monitor',               'Monitor',    'Home office', 5,    'Home office',        false, null),
  ('DF-014', 'Notebook Lenovo',       'Notebook',   'Home office', 6,    'Home office',        false, 'Transferido de Thamires RH'),
  ('DF-015', 'Monitor',               'Monitor',    'Home office', 6,    'Home office',        false, null),
  ('DF-016', 'All in One Lenovo',     'Computador', 'Home office', 7,    'Home office',        false, null),
  ('DF-017', 'All in One Arquimedes', 'Computador', 'Home office', 8,    'Home office',        false, null),
  ('DF-018', 'Monitor',               'Monitor',    'Home office', 8,    'Home office',        false, null),
  ('DF-019', 'Kit Mouse e Teclado',   'Periférico', 'Home office', 8,    'Home office',        false, null),
  ('DF-020', 'Headset',               'Headset',    'Home office', 8,    'Home office',        false, null),
  ('DF-021', 'All in One Arquimedes', 'Computador', 'Home office', 9,    'Home office',        false, null),
  ('DF-022', 'Monitor',               'Monitor',    'Home office', 9,    'Home office',        false, null),
  ('DF-023', 'Kit Mouse e Teclado',   'Periférico', 'Home office', 9,    'Home office',        false, null),
  ('DF-024', 'All in One Positivo',   'Computador', 'Home office', 10,   'Home office',        false, null),
  ('DF-025', 'Monitor LG',            'Monitor',    'Home office', 10,   'Home office',        false, null),
  ('DF-026', 'Kit Mouse e Teclado',   'Periférico', 'Home office', 10,   'Home office',        false, null),
  ('DF-027', 'All in One Positivo',   'Computador', 'Home office', 11,   'Home office',        false, null),
  ('DF-028', 'Monitor LG',            'Monitor',    'Home office', 11,   'Home office',        false, null),
  ('DF-029', 'Kit Mouse e Teclado',   'Periférico', 'Home office', 11,   'Home office',        false, null),
  ('DF-030', 'Notebook Lenovo',       'Notebook',   'Home office', 12,   'Home office',        false, null),
  ('DF-031', 'Notebook Samsung',      'Notebook',   'Home office', 13,   'Home office',        false, 'Transferido de Cecília'),
  ('DF-032', 'All in One Positivo',   'Computador', null,          null, 'Pendente devolução', false, 'Era de Gabriella, destino pendente'),
  ('DF-033', 'Monitor',               'Monitor',    null,          null, 'Pendente devolução', false, 'Era de Gabriella, destino pendente')
on conflict (id) do nothing;

-- ============================================================
-- SEED: Movimentações históricas
-- ============================================================
insert into movimentacoes (data, equipamento_id, acao, colaborador_id, responsavel) values
  ('2025-06-01', 'DF-011', 'Transferência de Patrícia para Thamires RH',  4,    'TI'),
  ('2025-06-05', 'DF-014', 'Transferência de Thamires RH para Monica',    6,    'TI'),
  ('2025-06-08', 'DF-031', 'Transferência de Cecília para Italo',         13,   'TI'),
  ('2025-06-10', 'DF-032', 'Devolução pendente — destino não confirmado', null, 'TI'),
  ('2025-06-10', 'DF-033', 'Devolução pendente — destino não confirmado', null, 'TI');
