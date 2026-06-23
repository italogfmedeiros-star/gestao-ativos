-- Migração: adiciona 'All in one' ao tipo de equipamento
-- Executar no SQL Editor do Supabase

-- 1. Remove a constraint antiga de tipo
ALTER TABLE equipamentos DROP CONSTRAINT IF EXISTS equipamentos_tipo_check;

-- 2. Adiciona nova constraint com 'All in one' incluído
ALTER TABLE equipamentos
  ADD CONSTRAINT equipamentos_tipo_check
  CHECK (tipo IN ('All in one','Computador','Notebook','Monitor','Teclado','Mouse','Headset','Periférico','Impressora','Smartphone','Outros'));

-- 3. Migra todos os equipamentos com tipo 'Computador' para 'All in one'
UPDATE equipamentos SET tipo = 'All in one' WHERE tipo = 'Computador';
