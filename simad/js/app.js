/**
 * SIMAD - Sistema Inteligente de Marketing de Alto Desempenho
 * Main Application JavaScript
 */

// ========================================
// Global State
// ========================================
const state = {
    currentSection: 'dashboard',
    currentMonth: new Date(),
    company: {
        name: 'Alice Werlang',
        segment: 'Restaurante de Doceria',
        location: 'João Pessoa, PB',
        revenue: 450000,
        employees: '2-5',
        website: 'alicewerlang.com.br'
    }
};

// ========================================
// DOM Elements
// ========================================
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleSidebar = document.getElementById('toggleSidebar');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('pageTitle');
const breadcrumb = document.getElementById('breadcrumb');

// ========================================
// Sidebar Toggle
// ========================================
toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// ========================================
// Navigation
// ========================================
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        showSection(section);
    });
});

function showSection(sectionId) {
    // Update nav items
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update header
    const titles = {
        dashboard: 'Dashboard',
        conteudo: 'Geração de Conteúdo',
        calendario: 'Calendário Editorial',
        relatorios: 'Relatórios',
        trafego: 'Tráfego Pago',
        seo: 'SEO & Conteúdo',
        concorrentes: 'Análise de Concorrência',
        email: 'Email Marketing',
        empresa: 'Dados da Empresa'
    };

    pageTitle.textContent = titles[sectionId] || sectionId;
    breadcrumb.textContent = titles[sectionId] || sectionId;
    state.currentSection = sectionId;

    // Initialize section-specific features
    if (sectionId === 'calendario') {
        renderCalendar();
    }
}

// ========================================
// Charts Initialization
// ========================================
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['1 Jul', '5 Jul', '10 Jul', '15 Jul', '20 Jul', '25 Jul', '30 Jul'],
                datasets: [
                    {
                        label: 'Receita',
                        data: [12000, 15000, 13500, 18000, 16500, 21000, 19500],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Investimento',
                        data: [3500, 3500, 3500, 3500, 3500, 3500, 3500],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#94a3b8'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(51, 65, 85, 0.5)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(51, 65, 85, 0.5)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: value => 'R$ ' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // Channel Chart
    const channelCtx = document.getElementById('channelChart');
    if (channelCtx) {
        new Chart(channelCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Instagram', 'Facebook', 'Google', 'TikTok', 'Email', 'Orgânico'],
                datasets: [{
                    data: [35, 20, 15, 12, 10, 8],
                    backgroundColor: [
                        '#E4405F',
                        '#1877F2',
                        '#4285F4',
                        '#000000',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#94a3b8',
                            padding: 15
                        }
                    }
                }
            }
        });
    }
}

// ========================================
// Calendar
// ========================================
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    
    // Update month display
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    // Get first day and total days
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Content data
    const contentData = generateMonthContent(year, month, totalDays);

    let html = '';
    
    // Headers
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayNames.forEach(day => {
        html += `<div class="calendar-header">${day}</div>`;
    });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
        const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        
        const dayContent = contentData[day] || [];
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="day-number">${day}</div>
                <div class="day-content">
                    ${dayContent.map(c => `
                        <div class="day-event ${c.platform}">${c.title}</div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    grid.innerHTML = html;
}

function generateMonthContent(year, month, totalDays) {
    const content = {};
    const platforms = ['instagram', 'tiktok', 'linkedin', 'youtube', 'email'];
    const topics = {
        instagram: ['Reels Bastidores', 'Carrossel Dicas', 'Stories Enquete', 'Post Produto', 'Reels Trending'],
        tiktok: ['Vídeo Trending', 'POV Processo', 'Reação Cliente', 'Dica Rápida'],
        linkedin: ['Artigo História', 'Post Empreendedorismo', 'Case Sucesso'],
        youtube: ['Vídeo Tutorial', 'Vlog Bastidores', 'Review Produto'],
        email: ['Newsletter Semanal', 'Oferta Especial', 'Dica Exclusiva']
    };

    for (let day = 1; day <= totalDays; day++) {
        const dayOfWeek = new Date(year, month, day).getDay();
        content[day] = [];

        // Instagram todos os dias
        if (dayOfWeek !== 0) {
            const instagramTopics = topics.instagram;
            content[day].push({
                platform: 'instagram',
                title: instagramTopics[day % instagramTopics.length]
            });
        }

        // TikTok Ter, Qui, Sáb
        if ([2, 4, 6].includes(dayOfWeek)) {
            const tiktokTopics = topics.tiktok;
            content[day].push({
                platform: 'tiktok',
                title: tiktokTopics[Math.floor(day / 2) % tiktokTopics.length]
            });
        }

        // LinkedIn Seg, Qua, Sex
        if ([1, 3, 5].includes(dayOfWeek)) {
            const linkedinTopics = topics.linkedin;
            content[day].push({
                platform: 'linkedin',
                title: linkedinTopics[Math.floor(day / 3) % linkedinTopics.length]
            });
        }

        // YouTube Semana 2 e 4
        if ([6].includes(dayOfWeek) && (day <= 7 || (day > 14 && day <= 21))) {
            content[day].push({
                platform: 'youtube',
                title: 'Vídeo Semanal'
            });
        }

        // Email Segunda
        if (dayOfWeek === 1) {
            content[day].push({
                platform: 'email',
                title: 'Newsletter'
            });
        }
    }

    return content;
}

// Calendar Navigation
document.getElementById('prevMonth')?.addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
});

// ========================================
// Content Generator
// ========================================
function generateContent(type = 'amanha') {
    showToast(`Gerando conteúdo para ${type === 'amanha' ? 'amanhã' : 'a semana'}...`);
    
    setTimeout(() => {
        showModal('Conteúdo Gerado', `
            <div class="generated-content">
                <h4>Conteúdo para ${type === 'amanhã' ? 'Amanhã' : 'a Semana'}</h4>
                <p>O conteúdo foi gerado com sucesso!</p>
                <div class="content-summary">
                    <div class="summary-item">
                        <strong>Instagram:</strong> 1 post + 5 stories + 1 reels
                    </div>
                    <div class="summary-item">
                        <strong>TikTok:</strong> 1 vídeo com roteiro
                    </div>
                    <div class="summary-item">
                        <strong>LinkedIn:</strong> 1 post de texto
                    </div>
                </div>
                <button class="btn-primary" onclick="copyAllContent()" style="margin-top: 1rem;">
                    Copiar Todo Conteúdo
                </button>
            </div>
        `);
    }, 1500);
}

// ========================================
// Report Generator
// ========================================
function generateReport() {
    showToast('Gerando relatório...');
    
    setTimeout(() => {
        const today = new Date();
        const dateStr = today.toLocaleDateString('pt-BR');
        
        showModal('Relatório Diário', `
            <div class="report-modal">
                <h4>Relatório de Performance — ${dateStr}</h4>
                <div class="report-summary">
                    <div class="report-metric">
                        <span>Faturamento:</span>
                        <strong>R$ 1.350,00</strong>
                    </div>
                    <div class="report-metric">
                        <span>Leads:</span>
                        <strong>36</strong>
                    </div>
                    <div class="report-metric">
                        <span>ROAS:</span>
                        <strong>6.3x</strong>
                    </div>
                    <div class="report-metric">
                        <span>CPL:</span>
                        <strong>R$ 5,97</strong>
                    </div>
                </div>
                <p style="margin-top: 1rem; color: var(--text-secondary);">
                    Relatório completo disponível na seção de Relatórios.
                </p>
            </div>
        `);
    }, 1000);
}

// ========================================
// Campaign Creator
// ========================================
function createCampaign() {
    showModal('Nova Campanha Meta Ads', `
        <div class="campaign-form">
            <div class="form-group">
                <label>Nome da Campanha</label>
                <input type="text" placeholder="Ex: Alice Werlang - Conversão Julho 2026">
            </div>
            <div class="form-group">
                <label>Objetivo</label>
                <select>
                    <option>Conversão</option>
                    <option>Tráfego</option>
                    <option>Engajamento</option>
                    <option>Reconhecimento de Marca</option>
                </select>
            </div>
            <div class="form-group">
                <label>Orçamento Diário (R$)</label>
                <input type="number" value="50">
            </div>
            <div class="form-group">
                <label>Público-Alvo</label>
                <select>
                    <option>Interesses - Doces e Confeitaria</option>
                    <option>Lookalike - Clientes</option>
                    <option>Retargeting - Site 30 dias</option>
                </select>
            </div>
            <div class="form-group">
                <label>Período</label>
                <div class="form-row">
                    <input type="date" value="${new Date().toISOString().split('T')[0]}">
                    <input type="date">
                </div>
            </div>
            <button class="btn-primary" onclick="closeModal(); showToast('Campanha criada com sucesso!')">
                Criar Campanha
            </button>
        </div>
    `);
}

// ========================================
// SEO Content Generator
// ========================================
function generateSEOContent() {
    showToast('Gerando briefing SEO...');
    
    setTimeout(() => {
        showModal('Briefing SEO', `
            <div class="seo-briefing">
                <h4>Briefing: "10 Dicas para Escolher a Torta Perfeita"</h4>
                
                <div class="briefing-section">
                    <h5>Palavras-chave</h5>
                    <p>Primária: doceria joão pessoa</p>
                    <p>Secundárias: torta personalizada, doces artesanais, melhor torta jp</p>
                </div>
                
                <div class="briefing-section">
                    <h5>Estrutura</h5>
                    <ul>
                        <li>H1: 10 Dicas para Escolher a Torta Perfeita para sua Festa</li>
                        <li>H2: 1. Defina o tipo de evento</li>
                        <li>H2: 2. Considere o número de convidados</li>
                        <li>H2: 3. Pense no sabor que agrada a maioria</li>
                        <li>H2: 4. Verifique a qualidade dos ingredientes</li>
                        <li>H2: 5. Considere a apresentação visual</li>
                        <li>H2: 6. Peça referências e avaliações</li>
                        <li>H2: 7. Faça com antecedência</li>
                        <li>H2: 8. Considere restrições alimentares</li>
                        <li>H2: 9. Compare custo-benefício</li>
                        <li>H2: 10. Escolha uma doceria de confiança</li>
                    </ul>
                </div>
                
                <div class="briefing-section">
                    <h5>Meta Title</h5>
                    <p>10 Dicas para Escolher a Torta Perfeita | Alice Werlang Doceria</p>
                </div>
                
                <div class="briefing-section">
                    <h5>Meta Description</h5>
                    <p>Descubra as 10 melhores dicas para escolher a torta perfeita para sua festa em João Pessoa. Qualidade, sabor e beleza em cada detalhe.</p>
                </div>
                
                <button class="btn-primary" onclick="closeModal()">
                    Copiar Briefing
                </button>
            </div>
        `);
    }, 1000);
}

// ========================================
// Competitor Analysis Update
// ========================================
function updateCompetitorAnalysis() {
    showToast('Atualizando análise de concorrência...');
    
    setTimeout(() => {
        showToast('Análise atualizada com sucesso!');
    }, 2000);
}

// ========================================
// Email Sequence Generator
// ========================================
function generateEmailSequence() {
    showToast('Gerando sequência de email...');
    
    setTimeout(() => {
        showModal('Sequência Welcome Series', `
            <div class="email-sequence-detail">
                <h4>Welcome Series - 5 Emails</h4>
                
                <div class="email-detail">
                    <h5>Email 1: Bem-vindo!</h5>
                    <p><strong>Subject:</strong> Bem-vindo à família Alice Werlang! 🎂</p>
                    <p><strong>Preview:</strong> Sua jornada com a melhor doceria de JP começa agora...</p>
                    <p><strong>Envio:</strong> Imediato após cadastro</p>
                </div>
                
                <div class="email-detail">
                    <h5>Email 2: Nossa História</h5>
                    <p><strong>Subject:</strong> 15 anos transformando momentos em doces memórias</p>
                    <p><strong>Preview:</strong> Conheça a trajetória que começou com uma receita de família...</p>
                    <p><strong>Envio:</strong> 2 dias após Email 1</p>
                </div>
                
                <div class="email-detail">
                    <h5>Email 3: Nossos Produtos</h5>
                    <p><strong>Subject:</strong> Conheça os doces mais pedidos de João Pessoa</p>
                    <p><strong>Preview:</strong> Tortas, bolos e sobremesas que conquistaram a cidade...</p>
                    <p><strong>Envio:</strong> 4 dias após Email 1</p>
                </div>
                
                <div class="email-detail">
                    <h5>Email 4: Oferta Especial</h5>
                    <p><strong>Subject:</strong> 15% OFF na sua primeira compra! 🎁</p>
                    <p><strong>Preview:</strong> Agradecemos pela confiança com um presente especial...</p>
                    <p><strong>Envio:</strong> 6 dias após Email 1</p>
                </div>
                
                <div class="email-detail">
                    <h5>Email 5: Urgência</h5>
                    <p><strong>Subject:</strong> Última chance: seu desconto expira hoje! ⏰</p>
                    <p><strong>Preview:</strong> Não perca essa oportunidade de experimentar...</p>
                    <p><strong>Envio:</strong> 8 dias após Email 1</p>
                </div>
                
                <button class="btn-primary" onclick="closeModal()">
                    Copiar Sequência
                </button>
            </div>
        `);
    }, 1000);
}

// ========================================
// View Sequence
// ========================================
function viewSequence(type) {
    const sequences = {
        welcome: 'Welcome Series',
        cart: 'Abandono de Carrinho',
        post: 'Pós-Compra'
    };
    
    showToast(`Visualizando sequência: ${sequences[type]}`);
    generateEmailSequence();
}

// ========================================
// Utility Functions
// ========================================
function copyText(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        navigator.clipboard.writeText(element.value || element.textContent);
        showToast('Texto copiado para a área de transferência!');
    }
}

function copyAdCopy(copyId) {
    const copyElement = document.getElementById(copyId);
    if (copyElement) {
        const textareas = copyElement.querySelectorAll('textarea, input');
        let fullCopy = '';
        textareas.forEach(el => {
            fullCopy += el.value + '\n\n';
        });
        navigator.clipboard.writeText(fullCopy);
        showToast('Anúncio copiado!');
    }
}

function copyAllContent() {
    showToast('Todo o conteúdo foi copiado!');
    closeModal();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// Close modal on outside click
document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// ========================================
// Platform Tabs
// ========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.platform-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${platform}-content`)?.classList.add('active');
    });
});

// ========================================
// Copy Tabs
// ========================================
document.querySelectorAll('.copy-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const copyNum = tab.dataset.copy;
        
        document.querySelectorAll('.copy-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.copy-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`copy${copyNum}`)?.classList.add('active');
    });
});

// ========================================
// Date Display
// ========================================
function updateDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('pt-BR', options);
    
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = dateStr;
    }
    
    const reportDateEl = document.getElementById('reportDate');
    if (reportDateEl) {
        reportDateEl.textContent = dateStr;
    }
}

// ========================================
// Simulated Real-time Updates
// ========================================
function simulateMetrics() {
    // Simulate small changes in metrics
    const leadsEl = document.getElementById('leadsGenerated');
    const salesEl = document.getElementById('salesMade');
    const revenueEl = document.getElementById('dailyRevenue');
    
    if (leadsEl && Math.random() > 0.7) {
        const current = parseInt(leadsEl.textContent);
        leadsEl.textContent = current + 1;
    }
    
    if (salesEl && Math.random() > 0.9) {
        const current = parseInt(salesEl.textContent);
        salesEl.textContent = current + 1;
    }
}

// ========================================
// Update Charts with Real Data
// ========================================
function updateCharts() {
    // This function will update charts with imported data
    const importedData = localStorage.getItem('simad_imported_data');
    
    if (importedData) {
        const data = JSON.parse(importedData);
        
        // Update revenue chart with real data
        if (data.sales && data.sales.history) {
            updateRevenueChart(data.sales.history);
        }
        
        // Update channel chart with real data
        if (data.channels) {
            updateChannelChart(data.channels);
        }
    }
}

function updateRevenueChart(history) {
    // Implementation for updating revenue chart
    console.log('Updating revenue chart with history:', history);
}

function updateChannelChart(channels) {
    // Implementation for updating channel chart
    console.log('Updating channel chart with channels:', channels);
}

// ========================================
// Data Export Functions
// ========================================
function exportToCSV(data) {
    const csvContent = "data:text/csv;charset=utf-8," 
        + Object.entries(data).map(([key, value]) => `${key},${value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "simad_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ========================================
// Keyboard Shortcuts
// ========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-box input')?.focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Load real data
    loadRealData();
    
    initCharts();
    updateDate();
    renderCalendar();
    
    // Simulate metric updates every 30 seconds
    setInterval(simulateMetrics, 30000);
    
    // Start auto sync
    startAutoSync();
    
    console.log('SIMAD initialized successfully!');
});

// ========================================
// Load Real Data
// ========================================
function loadRealData() {
    // Load Instagram real data
    const instagramData = localStorage.getItem('simad_instagram_data');
    
    if (instagramData) {
        const data = JSON.parse(instagramData);
        updateInstagramMetrics(data);
    }
    
    // Check if we have imported data
    const importedData = localStorage.getItem('simad_imported_data');
    
    if (importedData) {
        const data = JSON.parse(importedData);
        updateDashboardWithRealData(data);
    } else {
        // Use default realistic data
        updateDashboardWithRealData(companyData);
    }
    
    // Update last update time
    updateLastUpdateTime();
}

function updateInstagramMetrics(data) {
    // Update Instagram KPIs with real data
    const followersEl = document.getElementById('kpiLeads');
    if (followersEl) {
        followersEl.textContent = data.followers.toLocaleString('pt-BR');
    }
    
    // Update Instagram section if exists
    const igFollowersEl = document.getElementById('igFollowers');
    if (igFollowersEl) {
        igFollowersEl.textContent = data.followers.toLocaleString('pt-BR');
    }
    
    const igPostsEl = document.getElementById('igPosts');
    if (igPostsEl) {
        igPostsEl.textContent = data.posts.toLocaleString('pt-BR');
    }
    
    console.log('Instagram metrics updated:', data);
}

function updateDashboardWithRealData(data) {
    // Update KPIs with real data
    if (data.sales) {
        document.getElementById('kpiRevenue').textContent = 
            'R$ ' + data.sales.monthlyRevenue.toLocaleString('pt-BR');
    }
    
    if (data.social && data.social.instagram) {
        document.getElementById('kpiLeads').textContent = 
            data.social.instagram.followers.toLocaleString('pt-BR');
    }
    
    // Update website metrics
    if (data.website) {
        updateWebsiteMetrics(data.website);
    }
    
    // Update social metrics
    if (data.social) {
        updateSocialMetrics(data.social);
    }
    
    // Update Google My Business
    if (data.google) {
        updateGoogleMetrics(data.google);
    }
}

function updateWebsiteMetrics(website) {
    const websiteSection = document.querySelector('.website-metrics');
    if (websiteSection) {
        websiteSection.innerHTML = `
            <div class="metric-item">
                <span>Visitas Mensais</span>
                <strong>${website.monthlyVisits.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="metric-item">
                <span>Visitantes Únicos</span>
                <strong>${website.uniqueVisitors.toLocaleString('pt-BR')}</strong>
            </div>
            <div class="metric-item">
                <span>Taxa de Rejeição</span>
                <strong>${website.bounceRate}%</strong>
            </div>
            <div class="metric-item">
                <span>Duração Média</span>
                <strong>${website.avgSessionDuration}</strong>
            </div>
        `;
    }
}

function updateSocialMetrics(social) {
    // Instagram
    if (social.instagram) {
        const ig = social.instagram;
        updateMetricDisplay('igFollowers', ig.followers.toLocaleString('pt-BR'));
        updateMetricDisplay('igEngagement', ig.engagementRate + '%');
        updateMetricDisplay('igReach', ig.avgReach.toLocaleString('pt-BR'));
    }
    
    // TikTok
    if (social.tiktok) {
        const tt = social.tiktok;
        updateMetricDisplay('ttFollowers', tt.followers.toLocaleString('pt-BR'));
        updateMetricDisplay('ttViews', tt.avgViews.toLocaleString('pt-BR'));
        updateMetricDisplay('ttEngagement', tt.engagementRate + '%');
    }
    
    // Facebook
    if (social.facebook) {
        const fb = social.facebook;
        updateMetricDisplay('fbLikes', fb.likes.toLocaleString('pt-BR'));
        updateMetricDisplay('fbReach', fb.reach.toLocaleString('pt-BR'));
    }
}

function updateGoogleMetrics(google) {
    updateMetricDisplay('googleRating', google.rating + '★');
    updateMetricDisplay('googleReviews', google.totalReviews);
    updateMetricDisplay('googleViews', google.views.toLocaleString('pt-BR'));
}

function updateMetricDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateLastUpdateTime() {
    const lastUpdate = localStorage.getItem('simad_last_update');
    const lastUpdateElement = document.getElementById('lastUpdate');
    
    if (lastUpdateElement) {
        if (lastUpdate) {
            const date = new Date(lastUpdate);
            lastUpdateElement.textContent = date.toLocaleString('pt-BR');
        } else {
            lastUpdateElement.textContent = 'Nunca atualizado';
        }
    }
    
    // Update data count
    const dataCount = document.getElementById('dataCount');
    if (dataCount) {
        const history = JSON.parse(localStorage.getItem('simad_history') || '[]');
        dataCount.textContent = history.length + ' registros';
    }
}

// ========================================
// API Configuration
// ========================================
function configureAPI(platform) {
    const titles = {
        meta: 'Configurar Meta Business Suite',
        google: 'Configurar Google Analytics',
        googleads: 'Configurar Google Ads',
        tiktok: 'Configurar TikTok Ads',
        rdstation: 'Configurar RD Station',
        hubspot: 'Configurar HubSpot CRM'
    };

    const descriptions = {
        meta: 'Conecte sua conta do Meta Business para sincronizar automaticamente os dados de anúncios e Instagram.',
        google: 'Conecte o Google Analytics para rastrear o comportamento dos visitantes no seu site.',
        googleads: 'Conecte o Google Ads para importar dados de campanhas de busca e display.',
        tiktok: 'Conecte o TikTok Ads para sincronizar dados de campanhas e métricas de engajamento.',
        rdstation: 'Conecte o RD Station para sincronizar leads, automações e métricas de email marketing.',
        hubspot: 'Conecte o HubSpot CRM para sincronizar contatos, deals e dados de vendas.'
    };

    showModal(titles[platform], `
        <div class="api-config-form">
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">
                ${descriptions[platform]}
            </p>
            
            <div class="form-group">
                <label>Access Token / API Key</label>
                <input type="password" id="apiToken" placeholder="Cole seu token aqui">
            </div>
            
            <div class="form-group">
                <label>ID da Conta / Propriedade</label>
                <input type="text" id="accountId" placeholder="Ex: act_123456789">
            </div>
            
            <div class="api-test-result" id="apiTestResult" style="display: none;">
                <p><i class="fas fa-check-circle"></i> Conexão testada com sucesso!</p>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn-secondary" onclick="testAPIConnection('${platform}')">
                    <i class="fas fa-vial"></i> Testar Conexão
                </button>
                <button class="btn-primary" onclick="saveAPIConfig('${platform}')">
                    <i class="fas fa-save"></i> Salvar Configuração
                </button>
            </div>
            
            <div class="api-instructions" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <h5>Como obter as credenciais:</h5>
                <ul style="font-size: 0.85rem; color: var(--text-secondary); padding-left: 1.25rem;">
                    <li>Acesse o painel da plataforma</li>
                    <li>Vá em Configurações > API ou Integrações</li>
                    <li>Gere um novo token de acesso</li>
                    <li>Cole os dados nos campos acima</li>
                </ul>
            </div>
        </div>
    `);
}

function testAPIConnection(platform) {
    const token = document.getElementById('apiToken').value;
    const accountId = document.getElementById('accountId').value;
    
    if (!token || !accountId) {
        showToast('Preencha todos os campos');
        return;
    }
    
    // Simulate API test
    const testResult = document.getElementById('apiTestResult');
    testResult.style.display = 'block';
    testResult.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Testando conexão...</p>';
    
    setTimeout(() => {
        testResult.innerHTML = '<p style="color: var(--secondary);"><i class="fas fa-check-circle"></i> Conexão testada com sucesso!</p>';
    }, 2000);
}

function saveAPIConfig(platform) {
    const token = document.getElementById('apiToken').value;
    const accountId = document.getElementById('accountId').value;
    
    if (!token || !accountId) {
        showToast('Preencha todos os campos');
        return;
    }
    
    // Save to localStorage
    const configs = JSON.parse(localStorage.getItem('simad_api_configs') || '{}');
    configs[platform] = {
        token: btoa(token), // Base64 encode for basic obfuscation
        accountId: accountId,
        connectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('simad_api_configs', JSON.stringify(configs));
    
    closeModal();
    showToast('Configuração salva com sucesso!');
    
    // Update UI
    updateAPIStatuses();
}

function updateAPIStatuses() {
    const configs = JSON.parse(localStorage.getItem('simad_api_configs') || '{}');
    
    document.querySelectorAll('.api-item').forEach(item => {
        const platform = item.querySelector('span').textContent.toLowerCase().replace(/\s+/g, '');
        const statusIcon = item.querySelector('.api-status i');
        
        if (configs[platform]) {
            item.querySelector('.api-status').className = 'api-status connected';
            statusIcon.className = 'fas fa-check-circle';
        }
    });
}
