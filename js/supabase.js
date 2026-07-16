// Configuração do Supabase
const SUPABASE_URL = 'https://vmjujlpoawipgxhukbra.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtanVqbHBvYXdpcGd4aHVrYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE4NTksImV4cCI6MjA5OTc5Nzg1OX0.c3Xlvtxs_rPXoYvt9xGG-zt52u1K1hlAv87fzckMsDY';

// Inicializar Supabase (usando CDN)
let supabase = null;

function initSupabase() {
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
  }
  return false;
}

// Buscar todos os dados do dashboard
async function fetchDashboardData() {
  if (!supabase) {
    if (!initSupabase()) {
      console.error('Supabase não inicializado');
      return null;
    }
  }

  try {
    const { data, error } = await supabase
      .from('dashboard_data')
      .select('*')
      .order('platform');

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    return null;
  }
}

// Buscar dados de uma plataforma específica
async function fetchPlatformData(platform) {
  if (!supabase) {
    if (!initSupabase()) return null;
  }

  try {
    const { data, error } = await supabase
      .from('dashboard_data')
      .select('*')
      .eq('platform', platform);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Erro ao buscar dados de ${platform}:`, err);
    return null;
  }
}

// Atualizar um dado específico
async function updateMetric(platform, metricName, metricValue) {
  if (!supabase) {
    if (!initSupabase()) return false;
  }

  try {
    const { error } = await supabase
      .from('dashboard_data')
      .upsert({
        platform,
        metric_name: metricName,
        metric_value: metricValue,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'platform,metric_name'
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Erro ao atualizar:', err);
    return false;
  }
}

// Converter dados do Supabase para formato do dashboard
function parseSupabaseData(data) {
  const parsed = {};

  data.forEach(item => {
    if (!parsed[item.platform]) {
      parsed[item.platform] = {};
    }
    parsed[item.platform][item.metric_name] = item.metric_value;
  });

  return parsed;
}

// Atualizar interface do dashboard com dados do Supabase
function updateDashboardUI(data) {
  const parsed = parseSupabaseData(data);

  // Atualizar Instagram
  if (parsed.instagram) {
    const ig = parsed.instagram;
    updateElement('igFollowers', formatNumber(ig.followers));
    updateElement('igPosts', ig.posts);
    updateElement('igFollowing', ig.following);
    updateElement('igEngagement', ig.engagement_rate + '%');
  }

  // Atualizar Facebook
  if (parsed.facebook) {
    updateElement('fbFollowers', formatNumber(parsed.facebook.followers));
  }

  // Atualizar TikTok
  if (parsed.tiktok) {
    updateElement('ttFollowers', formatNumber(parsed.tiktok.followers));
  }

  // Atualizar Site
  if (parsed.site) {
    updateElement('siteVisits', formatNumber(parsed.site.monthly_visits));
    updateElement('siteDuration', parsed.site.avg_duration + 'min');
  }

  // Atualizar iFood
  if (parsed.ifood) {
    updateElement('ifoodRating', parsed.ifood.rating + '★');
    updateElement('ifoodOrders', formatNumber(parsed.ifood.monthly_orders));
  }

  // Atualizar AnotaAI
  if (parsed.anotaai) {
    updateElement('anotaaiRating', parsed.anotaai.rating + '★');
    updateElement('anotaaiOrders', formatNumber(parsed.anotaai.monthly_orders));
  }

  // Atualizar última atualização
  updateElement('lastUpdate', new Date().toLocaleString('pt-BR'));
}

// Helper para atualizar elemento
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Formatar números
function formatNumber(num) {
  if (!num || num === '0') return '0';
  return parseInt(num).toLocaleString('pt-BR');
}

// Função principal de atualização
async function refreshDashboard() {
  const btn = document.querySelector('.refresh-btn');
  if (btn) {
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Atualizando...';
  }

  const data = await fetchDashboardData();

  if (data) {
    updateDashboardUI(data);
    showToast('Dados atualizados com sucesso!');
  } else {
    showToast('Erro ao atualizar dados', 'error');
  }

  if (btn) {
    btn.classList.remove('loading');
    btn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Dados';
  }
}

// Exportar funções
window.SupabaseIntegration = {
  init: initSupabase,
  fetch: fetchDashboardData,
  refresh: refreshDashboard,
  update: updateMetric
};
