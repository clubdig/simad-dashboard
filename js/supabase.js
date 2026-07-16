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

  // Atualizar KPI cards
  if (parsed.instagram) {
    const ig = parsed.instagram;
    updateElement('igFollowers', formatNumber(ig.followers));
    updateElement('igInfo', formatNumber(ig.followers) + ' seguidores • ' + ig.posts + ' posts');
  }

  if (parsed.facebook) {
    const fb = parsed.facebook;
    if (fb.followers && fb.followers !== '0') {
      updateElement('fbFollowers', formatNumber(fb.followers));
      updateElement('fbInfo', formatNumber(fb.followers) + ' seguidores');
    }
  }

  if (parsed.tiktok) {
    const tt = parsed.tiktok;
    if (tt.followers && tt.followers !== '0') {
      updateElement('ttFollowers', formatNumber(tt.followers));
      updateElement('ttInfo', formatNumber(tt.followers) + ' seguidores');
    }
  }

  if (parsed.ifood) {
    const ifood = parsed.ifood;
    updateElement('ifoodRating', ifood.rating + '★');
    if (ifood.monthly_orders && ifood.monthly_orders !== '0') {
      updateElement('ifoodInfo', ifood.rating + '★ • ' + formatNumber(ifood.monthly_orders) + ' pedidos/mês ✅');
    }
  }

  if (parsed.site) {
    const site = parsed.site;
    if (site.monthly_visits && site.monthly_visits !== '0') {
      updateElement('siteInfo', formatNumber(site.monthly_visits) + ' visitas/mês');
    }
  }

  if (parsed.anotaai) {
    const anotaai = parsed.anotaai;
    if (anotaai.rating && anotaai.rating !== '0') {
      updateElement('anotaaiInfo', anotaai.rating + '★ • ' + formatNumber(anotaai.monthly_orders) + ' pedidos/mês');
    }
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
    btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Buscando dados...';
  }

  try {
    // Chamar Edge Function para buscar dados do Instagram
    const response = await fetch(`${SUPABASE_URL}/functions/v1/fetch-instagram`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success && result.data.instagram) {
      const ig = result.data.instagram;
      // Atualizar interface diretamente com os dados retornados
      updateElement('igFollowers', formatNumber(ig.followers));
      updateElement('igInfo', formatNumber(ig.followers) + ' seguidores • ' + ig.posts + ' posts');
      
      let msg = `Instagram: ${formatNumber(ig.followers)} seguidores`;
      if (result.errors && result.errors.length > 0) {
        msg += ` (${result.errors.length} erros)`
      }
      showToast(msg);
    } else {
      // Fallback: buscar dados do banco
      const data = await fetchDashboardData();
      if (data) {
        updateDashboardUI(data);
        showToast('Dados carregados do banco');
      }
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    // Fallback: buscar dados do banco
    const data = await fetchDashboardData();
    if (data) {
      updateDashboardUI(data);
      showToast('Dados carregados do banco');
    }
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
