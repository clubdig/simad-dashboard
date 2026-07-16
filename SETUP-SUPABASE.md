# Configuração do Supabase para o SIMAD

## Passo 1: Criar tabela no Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Clique em **SQL Editor** (menu lateral)
4. Cole o conteúdo do arquivo `supabase-schema.sql`
5. Clique em **Run**

## Passo 2: Pegar credenciais

1. No mesmo projeto, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** (chave que começa com `eyJ...`)

## Passo 3: Configurar no dashboard

1. Abra o arquivo `js/supabase.js`
2. Substitua:
   - `SUA_URL_AQUI` → sua Project URL
   - `SUA_ANON_KEY_AQUI` → sua anon key

3. Salve e faça push para o GitHub

## Passo 4: Atualizar dados

### Pelo dashboard:
- Clique no botão "Atualizar Dados" no topo do dashboard

### Pelo painel do Supabase:
1. Vá em **Table Editor**
2. Selecione tabela `dashboard_data`
3. Edite os valores diretamente

### Pelo SQL:
```sql
SELECT update_dashboard_data('instagram', 'followers', '70000');
SELECT update_dashboard_data('ifood', 'rating', '4.9');
```

## Estrutura da tabela

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| platform | text | Nome da plataforma (instagram, facebook, etc.) |
| metric_name | text | Nome da métrica (followers, rating, etc.) |
| metric_value | text | Valor da métrica |
| updated_at | timestamp | Data da última atualização |

## Plataformas suportadas

- `instagram` - followers, posts, following, engagement_rate
- `facebook` - followers
- `tiktok` - followers
- `site` - monthly_visits, avg_duration
- `ifood` - rating, monthly_orders
- `anotaai` - rating, monthly_orders
- `company` - name, fantasy_name, cnpj, employees, founded, units
