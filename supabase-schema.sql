-- Schema para o dashboard SIMAD no Supabase

-- Tabela principal de dados do dashboard
CREATE TABLE dashboard_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value VARCHAR(100) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, metric_name)
);

-- Inserir dados iniciais
INSERT INTO dashboard_data (platform, metric_name, metric_value) VALUES
-- Instagram
('instagram', 'followers', '69000'),
('instagram', 'posts', '2200'),
('instagram', 'following', '3200'),
('instagram', 'engagement_rate', '4.2'),
('instagram', 'url', 'https://instagram.com/alicetortas'),

-- Facebook
('facebook', 'followers', '0'),
('facebook', 'url', 'https://facebook.com/alicetortas'),

-- TikTok
('tiktok', 'followers', '0'),
('tiktok', 'url', 'https://tiktok.com/@alice_tortas'),

-- Site
('site', 'monthly_visits', '0'),
('site', 'avg_duration', '0'),
('site', 'url', 'https://alicewerlang.com.br'),

-- iFood
('ifood', 'rating', '4.9'),
('ifood', 'monthly_orders', '500'),
('ifood', 'url', 'https://www.ifood.com.br/delivery/joao-pessoa-pb/alice-werlang---bessa-jardim-oceania/3cf56f8a-8cab-4e77-a273-b58a0bc3ef98'),

-- AnotaAI
('anotaai', 'rating', '0'),
('anotaai', 'monthly_orders', '0'),
('anotaai', 'url', 'https://pedido.anota.ai/loja/alice-werlang'),

-- Empresa
('company', 'name', 'Alice Werlang'),
('company', 'fantasy_name', 'Alice Tortas'),
('company', 'cnpj', '39.158.279/0001-71'),
('company', 'employees', '20-99'),
('company', 'founded', '2010'),
('company', 'active_since', '2020'),
('company', 'units', '3'),
('company', 'addresses', 'Manaíra, Bessa, Jardim Oceânia');

-- Função para atualizar dados
CREATE OR REPLACE FUNCTION update_dashboard_data(
  p_platform VARCHAR,
  p_metric_name VARCHAR,
  p_metric_value VARCHAR
)
RETURNS void AS $$
BEGIN
  INSERT INTO dashboard_data (platform, metric_name, metric_value, updated_at)
  VALUES (p_platform, p_metric_name, p_metric_value, NOW())
  ON CONFLICT (platform, metric_name)
  DO UPDATE SET metric_value = p_metric_value, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Habilitar Row Level Security (RLS)
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (anon)
CREATE POLICY "Allow public read" ON dashboard_data
  FOR SELECT USING (true);

-- Política para inserção/atualização (requer service_role key)
CREATE POLICY "Allow service role write" ON dashboard_data
  FOR ALL USING (auth.role() = 'service_role');
