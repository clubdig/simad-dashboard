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
        daily: '<h4>Métricas do Dia</h4><p><strong>Faturamento:</strong> R$ 1.350,00</p><p><strong>Leads:</strong> 36</p><p><strong>ROAS:</strong> 6.3x</p><p><strong>CPL:</strong> R$ 5,97</p><p><strong>CTR:</strong> 2.7%</p><h4>O que funcionou</h4><ul><li>Reels de bastidores — 2.340 views</li><li>Stories com enquete — 89% resposta</li><li>Retargeting — ROAS 8.2x</li></ul><h4>Top 3 Ações Amanhã</h4><ol><li>Ajustar horário do post para 19h</li><li>Pausar anúncio problemático</li><li>Publicar Reels de depoimento</li></ol>',
        weekly: '<h4>Resumo da Semana</h4><p><strong>Seguidores ganhos:</strong> +350</p><p><strong>Melhor dia:</strong> Sexta (45 leads)</p><p><strong>Engajamento médio:</strong> 4.2%</p><h4>Tendências</h4><ul><li>Crescimento estável</li><li>Reels com melhor performance</li><li>Stories com alta interação</li></ul>',
        monthly: '<h4>Resumo Mensal</h4><p><strong>Crescimento seguidores:</strong> +1.500</p><p><strong>Total posts:</strong> 45</p><p><strong>Alcance total:</strong> 450.000</p><h4>Progresso da Meta</h4><p>Meta: 80.000 seguidores</p><p>Atual: 69.000 (86.3%)</p><p>Faltam: 11.000 seguidores</p>'
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
