const state = { currentSection: 'dashboard', currentMonth: new Date() };

const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleSidebar = document.getElementById('toggleSidebar');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('pageTitle');
const breadcrumb = document.getElementById('breadcrumb');

toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(item.dataset.section);
    });
});

function showSection(sectionId) {
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');
    const titles = { dashboard: 'Dashboard', conteudo: 'Geração de Conteúdo', calendario: 'Calendário Editorial', relatorios: 'Relatórios', trafego: 'Tráfego Pago', concorrentes: 'Análise de Concorrência', empresa: 'Dados da Empresa' };
    pageTitle.textContent = titles[sectionId] || sectionId;
    breadcrumb.textContent = titles[sectionId] || sectionId;
    state.currentSection = sectionId;
    if (sectionId === 'calendario') renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    document.getElementById('currentMonth').textContent = monthNames[month] + ' ' + year;
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    let html = '';
    ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => { html += '<div class="calendar-header">' + d + '</div>'; });
    for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day empty"></div>';
    const platforms = ['instagram','tiktok','linkedin','email'];
    for (let day = 1; day <= totalDays; day++) {
        const dow = new Date(year, month, day).getDay();
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        let events = '';
        if (dow !== 0) events += '<div class="day-event instagram">Reels</div>';
        if ([2,4,6].includes(dow)) events += '<div class="day-event tiktok">TikTok</div>';
        if ([1,3,5].includes(dow)) events += '<div class="day-event linkedin">LinkedIn</div>';
        if (dow === 1) events += '<div class="day-event email">Newsletter</div>';
        html += '<div class="calendar-day' + (isToday ? ' today' : '') + '"><div class="day-number">' + day + '</div><div class="day-content">' + events + '</div></div>';
    }
    grid.innerHTML = html;
}

document.getElementById('prevMonth')?.addEventListener('click', () => { state.currentMonth.setMonth(state.currentMonth.getMonth() - 1); renderCalendar(); });
document.getElementById('nextMonth')?.addEventListener('click', () => { state.currentMonth.setMonth(state.currentMonth.getMonth() + 1); renderCalendar(); });

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.platform-content').forEach(c => c.classList.remove('active'));
        document.getElementById(btn.dataset.platform + '-content')?.classList.add('active');
    });
});

function copyText(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) { navigator.clipboard.writeText(el.value || el.textContent); showToast('Copiado!'); }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

function closeModal() { document.getElementById('modal').classList.remove('active'); }

document.getElementById('modal')?.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(); });

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function showReport(type) {
    const titles = { daily: 'Relatório Diário', weekly: 'Relatório Semanal', monthly: 'Relatório Mensal' };
    const reports = {
        daily: '<h4>Performance por Plataforma</h4><p><strong>Instagram:</strong> 69.000 seguidores • 4.2% engajamento • 15.000 alcance</p><p><strong>Facebook:</strong> 12.500 seguidores • 3.1% engajamento • 5.200 alcance</p><p><strong>TikTok:</strong> 8.300 seguidores • 6.5% engajamento • 22.000 views</p><p><strong>Site:</strong> 140 visitas • 2.8min duração média</p><h4>Delivery</h4><p><strong>iFood:</strong> 42 pedidos • R$ 1.890 faturamento • 4.7★</p><p><strong>AnotaAI:</strong> 23 pedidos • R$ 966 faturamento • 4.5★</p><p><strong>Total:</strong> 65 pedidos • R$ 2.856 faturamento delivery</p><h4>O que funcionou</h4><ul><li>Reels de bastidores — 2.340 views no Instagram</li><li>TikTok trending — 8.500 views orgânicas</li><li>iFood Ads — ROAS 6.2x</li></ul>',
        weekly: '<h4>Crescimento Semanal</h4><p><strong>Instagram:</strong> +350 seguidores (0.5% crescimento)</p><p><strong>Facebook:</strong> +180 seguidores (1.5% crescimento)</p><p><strong>TikTok:</strong> +1.200 seguidores (16.9% crescimento)</p><p><strong>Site:</strong> +8% visitas vs semana anterior</p><h4>Delivery</h4><p><strong>iFood:</strong> 294 pedidos na semana • R$ 13.230</p><p><strong>AnotaAI:</strong> 161 pedidos na semana • R$ 6.762</p><p><strong>Total Semanal:</strong> 455 pedidos • R$ 19.992</p><h4>Tendências</h4><ul><li>TikTok crescendo mais rápido que outras plataformas</li><li>Reels com melhor performance que posts estáticos</li><li>iFood com mais pedidos que AnotaAI</li></ul>',
        monthly: '<h4>Resumo Mensal</h4><p><strong>Seguidores Totais:</strong> 89.800 (Instagram + Facebook + TikTok)</p><p><strong>Crescimento:</strong> +2.800 seguidores no mês</p><p><strong>Alcance Total:</strong> 450.000 pessoas</p><p><strong>Interações:</strong> 38.500 curtidas/comentários</p><h4>Delivery Mensal</h4><p><strong>iFood:</strong> 1.260 pedidos • R$ 56.700 faturamento</p><p><strong>AnotaAI:</strong> 690 pedidos • R$ 28.980 faturamento</p><p><strong>Site:</strong> 120 pedidos • R$ 5.400 faturamento</p><p><strong>Total Mensal:</strong> 2.070 pedidos • R$ 91.080</p><h4>Metas</h4><p>Meta seguidores: 95.000 (86.3% atingido)</p><p>Meta pedidos/dia: 75 (92% atingido)</p>'
    };
    showModal(titles[type], reports[type]);
}

function updateDate() {
    const d = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const el = document.getElementById('currentDate');
    if (el) el.textContent = d;
}

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    renderCalendar();
    console.log('SIMAD initialized!');
});
