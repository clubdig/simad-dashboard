/**
 * SIMAD - Data Import Module
 * Sistema de importação e atualização de dados
 */

// ========================================
// Configuração de APIs
// ========================================
const apiConfig = {
    // Meta (Facebook/Instagram)
    meta: {
        enabled: false,
        accessToken: '',
        adAccountId: '',
        instagramAccountId: '',
        pixelId: ''
    },
    
    // Google
    google: {
        enabled: false,
        analyticsId: '',
        adsCustomerId: '',
        searchConsoleProperty: '',
        myBusinessId: ''
    },
    
    // TikTok
    tiktok: {
        enabled: false,
        accessToken: '',
        advertiserId: ''
    },
    
    // Email Marketing
    email: {
        provider: 'rdstation', // rdstation, mailchimp, activecampaign
        apiKey: '',
        listId: ''
    },
    
    // CRM
    crm: {
        provider: 'rdstation', // rdstation, hubspot, pipedrive
        apiKey: ''
    }
};

// ========================================
// Importação Manual de Dados
// ========================================
class DataImporter {
    constructor() {
        this.data = this.loadData();
    }

    // Carregar dados salvos
    loadData() {
        const saved = localStorage.getItem('simad_data');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            lastUpdate: null,
            metrics: {},
            history: []
        };
    }

    // Salvar dados
    saveData() {
        localStorage.setItem('simad_data', JSON.stringify(this.data));
    }

    // Importar dados manualmente
    importManualData(source, metrics) {
        const timestamp = new Date().toISOString();
        
        this.data.lastUpdate = timestamp;
        this.data.metrics[source] = {
            ...metrics,
            importedAt: timestamp
        };
        
        // Adicionar ao histórico
        this.data.history.push({
            source,
            metrics,
            timestamp
        });
        
        this.saveData();
        return this.data;
    }

    // Importar dados do Meta Ads
    importMetaAds(data) {
        const metrics = {
            spend: data.spend || 0,
            impressions: data.impressions || 0,
            clicks: data.clicks || 0,
            ctr: data.clicks / data.impressions * 100 || 0,
            cpc: data.spend / data.clicks || 0,
            conversions: data.conversions || 0,
            cpl: data.spend / data.conversions || 0,
            roas: data.revenue / data.spend || 0,
            revenue: data.revenue || 0
        };
        
        return this.importManualData('metaAds', metrics);
    }

    // Importar dados do Google Analytics
    importGoogleAnalytics(data) {
        const metrics = {
            sessions: data.sessions || 0,
            users: data.users || 0,
            pageviews: data.pageviews || 0,
            bounceRate: data.bounceRate || 0,
            avgSessionDuration: data.avgSessionDuration || 0,
            conversions: data.conversions || 0,
            conversionRate: data.conversions / data.sessions * 100 || 0
        };
        
        return this.importManualData('googleAnalytics', metrics);
    }

    // Importar dados de Instagram
    importInstagram(data) {
        const metrics = {
            followers: data.followers || 0,
            reach: data.reach || 0,
            impressions: data.impressions || 0,
            engagement: data.engagement || 0,
            engagementRate: data.engagement / data.reach * 100 || 0,
            profileViews: data.profileViews || 0,
            websiteClicks: data.websiteClicks || 0
        };
        
        return this.importManualData('instagram', metrics);
    }

    // Importar dados de Email
    importEmailData(data) {
        const metrics = {
            subscribers: data.subscribers || 0,
            sent: data.sent || 0,
            opens: data.opens || 0,
            openRate: data.opens / data.sent * 100 || 0,
            clicks: data.clicks || 0,
            clickRate: data.clicks / data.sent * 100 || 0,
            unsubscribed: data.unsubscribed || 0,
            revenue: data.revenue || 0
        };
        
        return this.importManualData('email', metrics);
    }

    // Importar dados de Vendas
    importSalesData(data) {
        const metrics = {
            revenue: data.revenue || 0,
            orders: data.orders || 0,
            avgTicket: data.revenue / data.orders || 0,
            newCustomers: data.newCustomers || 0,
            returningCustomers: data.returningCustomers || 0,
            returningRate: data.returningCustomers / data.orders * 100 || 0
        };
        
        return this.importManualData('sales', metrics);
    }

    // Importar dados de WhatsApp
    importWhatsAppData(data) {
        const metrics = {
            leads: data.leads || 0,
            conversations: data.conversations || 0,
            orders: data.orders || 0,
            revenue: data.revenue || 0,
            responseTime: data.responseTime || 'N/A',
            conversionRate: data.orders / data.conversations * 100 || 0,
            avgOrderValue: data.revenue / data.orders || 0
        };
        
        return this.importManualData('whatsapp', metrics);
    }

    // Obter métricas atuais
    getCurrentMetrics() {
        return {
            ...companyData,
            imported: this.data.metrics,
            lastUpdate: this.data.lastUpdate
        };
    }

    // Obter histórico
    getHistory(source = null, days = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        let history = this.data.history.filter(h => 
            new Date(h.timestamp) >= cutoff
        );
        
        if (source) {
            history = history.filter(h => h.source === source);
        }
        
        return history;
    }

    // Calcular tendências
    calculateTrends(metric, days = 7) {
        const history = this.getHistory(null, days);
        
        if (history.length < 2) {
            return { trend: 'stable', change: 0 };
        }
        
        const recent = history.slice(-1)[0]?.metrics[metric] || 0;
        const previous = history.slice(-2, -1)[0]?.metrics[metric] || 0;
        
        if (previous === 0) return { trend: 'stable', change: 0 };
        
        const change = ((recent - previous) / previous) * 100;
        
        return {
            trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
            change: change.toFixed(1)
        };
    }
}

// ========================================
// Instância global
// ========================================
const dataImporter = new DataImporter();

// ========================================
// UI de Importação
// ========================================
function showImportModal(source) {
    const titles = {
        meta: 'Importar Dados do Meta Ads',
        google: 'Importar Dados do Google Analytics',
        instagram: 'Importar Dados do Instagram',
        email: 'Importar Dados de Email Marketing',
        sales: 'Importar Dados de Vendas',
        whatsapp: 'Importar Dados do WhatsApp'
    };

    const fields = {
        meta: `
            <div class="form-group">
                <label>Investimento (R$)</label>
                <input type="number" id="import_spend" step="0.01">
            </div>
            <div class="form-group">
                <label>Impressões</label>
                <input type="number" id="import_impressions">
            </div>
            <div class="form-group">
                <label>Cliques</label>
                <input type="number" id="import_clicks">
            </div>
            <div class="form-group">
                <label>Conversões</label>
                <input type="number" id="import_conversions">
            </div>
            <div class="form-group">
                <label>Receita (R$)</label>
                <input type="number" id="import_revenue" step="0.01">
            </div>
        `,
        google: `
            <div class="form-group">
                <label>Sessões</label>
                <input type="number" id="import_sessions">
            </div>
            <div class="form-group">
                <label>Usuários</label>
                <input type="number" id="import_users">
            </div>
            <div class="form-group">
                <label>Pageviews</label>
                <input type="number" id="import_pageviews">
            </div>
            <div class="form-group">
                <label>Taxa de Rejeição (%)</label>
                <input type="number" id="import_bounceRate" step="0.1">
            </div>
            <div class="form-group">
                <label>Conversões</label>
                <input type="number" id="import_conversions">
            </div>
        `,
        instagram: `
            <div class="form-group">
                <label>Seguidores</label>
                <input type="number" id="import_followers">
            </div>
            <div class="form-group">
                <label>Alcance</label>
                <input type="number" id="import_reach">
            </div>
            <div class="form-group">
                <label>Impressões</label>
                <input type="number" id="import_impressions">
            </div>
            <div class="form-group">
                <label>Engajamentos (likes + comentários)</label>
                <input type="number" id="import_engagement">
            </div>
            <div class="form-group">
                <label>Visitas ao perfil</label>
                <input type="number" id="import_profileViews">
            </div>
            <div class="form-group">
                <label>Cliques no site</label>
                <input type="number" id="import_websiteClicks">
            </div>
        `,
        email: `
            <div class="form-group">
                <label>Assinantes</label>
                <input type="number" id="import_subscribers">
            </div>
            <div class="form-group">
                <label>Emails Enviados</label>
                <input type="number" id="import_sent">
            </div>
            <div class="form-group">
                <label>Aberturas</label>
                <input type="number" id="import_opens">
            </div>
            <div class="form-group">
                <label>Cliques</label>
                <input type="number" id="import_clicks">
            </div>
            <div class="form-group">
                <label>Receita (R$)</label>
                <input type="number" id="import_revenue" step="0.01">
            </div>
        `,
        sales: `
            <div class="form-group">
                <label>Receita Total (R$)</label>
                <input type="number" id="import_revenue" step="0.01">
            </div>
            <div class="form-group">
                <label>Pedidos</label>
                <input type="number" id="import_orders">
            </div>
            <div class="form-group">
                <label>Novos Clientes</label>
                <input type="number" id="import_newCustomers">
            </div>
            <div class="form-group">
                <label>Clientes Recorrentes</label>
                <input type="number" id="import_returningCustomers">
            </div>
        `,
        whatsapp: `
            <div class="form-group">
                <label>Leads via WhatsApp</label>
                <input type="number" id="import_whatsappLeads">
            </div>
            <div class="form-group">
                <label>Conversas Iniciadas</label>
                <input type="number" id="import_whatsappConversations">
            </div>
            <div class="form-group">
                <label>Pedidos via WhatsApp</label>
                <input type="number" id="import_whatsappOrders">
            </div>
            <div class="form-group">
                <label>Receita via WhatsApp (R$)</label>
                <input type="number" id="import_whatsappRevenue" step="0.01">
            </div>
            <div class="form-group">
                <label>Tempo Médio de Resposta</label>
                <input type="text" id="import_whatsappResponseTime" placeholder="Ex: 5 minutos">
            </div>
        `
    };

    showModal(titles[source], `
        <div class="import-form">
            <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                Importe os dados manualmente das plataformas ou copie/cole das planilhas.
            </p>
            ${fields[source]}
            <div class="form-group">
                <label>Data de Referência</label>
                <input type="date" id="import_date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <button class="btn-primary" onclick="processImport('${source}')">
                <i class="fas fa-download"></i> Importar Dados
            </button>
        </div>
    `);
}

// ========================================
// Processar Importação
// ========================================
function processImport(source) {
    const date = document.getElementById('import_date').value;
    
    let data = {};
    
    switch (source) {
        case 'meta':
            data = {
                spend: parseFloat(document.getElementById('import_spend').value) || 0,
                impressions: parseInt(document.getElementById('import_impressions').value) || 0,
                clicks: parseInt(document.getElementById('import_clicks').value) || 0,
                conversions: parseInt(document.getElementById('import_conversions').value) || 0,
                revenue: parseFloat(document.getElementById('import_revenue').value) || 0
            };
            dataImporter.importMetaAds(data);
            break;
            
        case 'google':
            data = {
                sessions: parseInt(document.getElementById('import_sessions').value) || 0,
                users: parseInt(document.getElementById('import_users').value) || 0,
                pageviews: parseInt(document.getElementById('import_pageviews').value) || 0,
                bounceRate: parseFloat(document.getElementById('import_bounceRate').value) || 0,
                conversions: parseInt(document.getElementById('import_conversions').value) || 0
            };
            dataImporter.importGoogleAnalytics(data);
            break;
            
        case 'instagram':
            data = {
                followers: parseInt(document.getElementById('import_followers').value) || 0,
                reach: parseInt(document.getElementById('import_reach').value) || 0,
                impressions: parseInt(document.getElementById('import_impressions').value) || 0,
                engagement: parseInt(document.getElementById('import_engagement').value) || 0,
                profileViews: parseInt(document.getElementById('import_profileViews').value) || 0,
                websiteClicks: parseInt(document.getElementById('import_websiteClicks').value) || 0
            };
            dataImporter.importInstagram(data);
            break;
            
        case 'email':
            data = {
                subscribers: parseInt(document.getElementById('import_subscribers').value) || 0,
                sent: parseInt(document.getElementById('import_sent').value) || 0,
                opens: parseInt(document.getElementById('import_opens').value) || 0,
                clicks: parseInt(document.getElementById('import_clicks').value) || 0,
                revenue: parseFloat(document.getElementById('import_revenue').value) || 0
            };
            dataImporter.importEmailData(data);
            break;
            
        case 'sales':
            data = {
                revenue: parseFloat(document.getElementById('import_revenue').value) || 0,
                orders: parseInt(document.getElementById('import_orders').value) || 0,
                newCustomers: parseInt(document.getElementById('import_newCustomers').value) || 0,
                returningCustomers: parseInt(document.getElementById('import_returningCustomers').value) || 0
            };
            dataImporter.importSalesData(data);
            break;
            
        case 'whatsapp':
            data = {
                leads: parseInt(document.getElementById('import_whatsappLeads').value) || 0,
                conversations: parseInt(document.getElementById('import_whatsappConversations').value) || 0,
                orders: parseInt(document.getElementById('import_whatsappOrders').value) || 0,
                revenue: parseFloat(document.getElementById('import_whatsappRevenue').value) || 0,
                responseTime: document.getElementById('import_whatsappResponseTime').value || 'N/A'
            };
            dataImporter.importWhatsAppData(data);
            break;
    }
    
    closeModal();
    showToast(`Dados de ${source} importados com sucesso!`);
    
    // Atualizar dashboard
    updateDashboardWithImportedData();
}

// ========================================
// Atualizar Dashboard
// ========================================
function updateDashboardWithImportedData() {
    const metrics = dataImporter.getCurrentMetrics();
    
    // Atualizar KPIs se houver dados importados
    if (metrics.imported.metaAds) {
        const meta = metrics.imported.metaAds;
        document.getElementById('kpiROAS').textContent = meta.roas.toFixed(1) + 'x';
    }
    
    if (metrics.imported.instagram) {
        const ig = metrics.imported.instagram;
        const followersEl = document.querySelector('[data-metric="followers"]');
        if (followersEl) {
            followersEl.textContent = ig.followers.toLocaleString('pt-BR');
        }
    }
    
    if (metrics.imported.whatsapp) {
        const wa = metrics.imported.whatsapp;
        // Update WhatsApp metrics display
        updateMetricDisplay('whatsappLeads', wa.leads.toLocaleString('pt-BR'));
        updateMetricDisplay('whatsappOrders', wa.orders.toLocaleString('pt-BR'));
        updateMetricDisplay('whatsappRevenue', 'R$ ' + wa.revenue.toLocaleString('pt-BR'));
    }
    
    // Update history display
    updateImportHistory();
    
    // Recarregar gráficos
    updateCharts();
}

function updateImportHistory() {
    const history = dataImporter.getHistory();
    const historyContainer = document.getElementById('importHistory');
    
    if (historyContainer && history.length > 0) {
        let html = '';
        
        history.slice().reverse().forEach(item => {
            const date = new Date(item.timestamp);
            const sourceNames = {
                metaAds: 'Meta Ads',
                googleAnalytics: 'Google Analytics',
                instagram: 'Instagram',
                email: 'Email Marketing',
                sales: 'Vendas',
                whatsapp: 'WhatsApp'
            };
            
            html += `
                <div class="history-item">
                    <div class="history-icon">
                        <i class="fas fa-file-import"></i>
                    </div>
                    <div class="history-info">
                        <strong>${sourceNames[item.source] || item.source}</strong>
                        <span>${date.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
    }
}

// ========================================
// Exportar Dados
// ========================================
function exportData(format = 'json') {
    const data = dataImporter.getCurrentMetrics();
    
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simad-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    } else if (format === 'csv') {
        exportToCSV(data);
    }
    
    showToast('Dados exportados com sucesso!');
}

function exportToCSV(data) {
    // Implementar exportação CSV
    showToast('Exportação CSV em desenvolvimento');
}

// ========================================
// Sincronização Automática (Simulada)
// ========================================
function startAutoSync() {
    // Simular atualização a cada 5 minutos
    setInterval(() => {
        simulateDataUpdate();
    }, 300000); // 5 minutos
    
    // Update history on load
    updateImportHistory();
    
    console.log('Auto-sync iniciado');
}

function simulateDataUpdate() {
    // Simular pequenas variações nos dados
    const variations = {
        instagramFollowers: Math.floor(Math.random() * 10) - 3,
        websiteVisits: Math.floor(Math.random() * 20) - 8,
        whatsappLeads: Math.floor(Math.random() * 5) - 2
    };
    
    // Atualizar dados
    companyData.social.instagram.followers += variations.instagramFollowers;
    companyData.website.monthlyVisits += variations.websiteVisits;
    
    // Log para debug
    console.log('Dados atualizados:', variations);
    
    // Notificar se houver mudanças significativas
    if (Math.abs(variations.instagramFollowers) > 5) {
        showToast(`Instagram: ${variations.instagramFollowers > 0 ? '+' : ''}${variations.instagramFollowers} seguidores`);
    }
}
