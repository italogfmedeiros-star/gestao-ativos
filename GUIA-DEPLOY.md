# Guia de Deploy — Dermaflora Ativos

## 1. Supabase (banco de dados)

1. Acesse [supabase.com](https://supabase.com) e crie o projeto **gestao-ativos**
2. Vá em **SQL Editor** e execute o conteúdo completo de `supabase/schema.sql`
3. Copie as credenciais em **Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`

## 2. Variáveis de ambiente locais

Crie o arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 4. Deploy na Vercel

1. Suba o projeto para o GitHub
2. Na Vercel, importe o repositório
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
4. Deploy automático a cada push na `main`

## 5. Segurança Supabase (opcional)

Por padrão, Row Level Security (RLS) está desativado — acesso via anon key é irrestrito.
Para uso em produção, considere habilitar RLS com políticas adequadas.
