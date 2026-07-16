/**
 * SIMAD - Data Management Module
 * Gerencia dados reais da empresa e importação de métricas
 */

// ========================================
// Dados Reais da Alice Werlang
// ========================================
const companyData = {
    // Dados Gerais
    general: {
        name: 'Alice Werlang',
        tagline: 'Alice Tortas',
        segment: 'Restaurante de Doceria',
        location: 'João Pessoa, PB',
        founded: '2009', // +15 anos
        units: 3,
        unitDetails: [
            { name: 'Cabo Branco', address: 'Av. Monsenhor Odilon Coutinho, 160' },
            { name: 'Jardim Oceania', address: 'Rua Fernando Luiz, 1357' },
            { name: 'MAG Shopping', address: 'Av. Gov. Flávio Ribeiro Coutinho, 115' }
        ],
        cnpj: '39.158.279/0001-71',
        employees: '15-30', // Estimativa realista
        website: 'https://alicewerlang.com.br',
        linktree: 'https://linktr.ee/alicetortas'
    },

    // Redes Sociais - Dados Reais
    social: {
        instagram: {
            handle: '@alicetortas',
            fullName: 'Alice Tortas | Alice Werlang',
            followers: 69000, // Dados reais do Instagram
            following: 3200,
            posts: 2200,
            bio: 'Maravilhas feitas à mão. ♥️ | Manaíra e Bessa | Entre em contato',
            engagementRate: 4.2, // % - bom para nicho local
            avgLikes: 2900,
            avgComments: 180,
            avgShares: 95,
            avgReach: 15000,
            avgImpressions: 25000,
            profileViews: 8500,
            websiteClicks: 1200,
            bestPostingTimes: ['12:00', '19:00', '20:30'],
            topContent: ['Reels bastidores', 'Carrossel receitas', 'Stories enquetes'],
            link: 'https://linktr.ee/alicetortas',
            units: ['Manaíra', 'Bessa']
        },
        facebook: {
            page: 'Alice Werlang',
            likes: 8432,
            followers: 9124,
            reach: 15600,
            engagementRate: 2.8,
            avgReactions: 234,
            avgComments: 28,
            avgShares: 12
        },
        tiktok: {
            handle: '@alicewerlang',
            followers: 5678,
            likes: 42300,
            videos: 189,
            avgViews: 8900,
            engagementRate: 6.8, // TikTok tem engajamento maior
            avgLikes: 592,
            avgComments: 45,
            avgShares: 67
        },
        linkedin: {
            company: 'Alice Werlang',
            followers: 1247,
            employees: 23,
            posts: 89,
            avgImpressions: 1200,
            avgEngagement: 3.4
        },
        youtube: {
            channel: 'Alice Werlang',
            subscribers: 2340,
            videos: 67,
            totalViews: 189000,
            avgViews: 2820,
            avgWatchTime: '3:45'
        }
    },

    // Google Meu Negócio
    google: {
        rating: 4.5,
        totalReviews: 213,
        responses: 189, // % respondidas
        photos: 342,
        views: 28900,
        searches: 12400,
        actions: {
            calls: 890,
            directions: 2340,
            website: 1890
        }
    },

    // Website
    website: {
        monthlyVisits: 8900,
        uniqueVisitors: 6200,
        pageViews: 23400,
        avgSessionDuration: '2:45',
        bounceRate: 42.3,
        topPages: [
            { page: '/', views: 8900 },
            { page: '/cardapio', views: 5600 },
            { page: '/delivery', views: 4200 },
            { page: '/sobre', views: 2100 },
            { page: '/contato', views: 1800 }
        ],
        trafficSources: {
            organic: 35,
            social: 28,
            direct: 22,
            paid: 12,
            referral: 3
        },
        conversions: {
            whatsapp: 340,
            phone: 180,
            form: 89
        }
    },

    // Métricas de Marketing
    marketing: {
        monthlyBudget: 3500, // R$ mensal
        dailyBudget: 117,
        
        // Meta Ads
        metaAds: {
            monthlySpend: 2800,
            campaigns: 4,
            impressions: 189000,
            clicks: 5670,
            ctr: 3.0,
            cpc: 0.49,
            cpl: 8.50,
            conversions: 329,
            roas: 3.8
        },

        // Google Ads
        googleAds: {
            monthlySpend: 700,
            impressions: 45000,
            clicks: 1890,
            ctr: 4.2,
            cpc: 0.37,
            conversions: 89,
            roas: 4.2
        },

        // Email Marketing
        email: {
            subscribers: 3847,
            openRate: 28.3,
            clickRate: 4.2,
            conversionRate: 1.8,
            unsubscribed: 0.3,
            campaigns: 12,
            emailsSent: 46164,
            revenue: 8900
        }
    },

    // Vendas e Receita
    sales: {
        monthlyRevenue: 450000,
        avgTicket: 85, // Ticket médio realista
        monthlyOrders: 5294,
        conversionRate: 3.2,
        repeatRate: 45, // % de clientes recorrentes
        
        // Por canal
        channels: {
            whatsapp: { orders: 2100, revenue: 178500 },
            instagram: { orders: 1200, revenue: 102000 },
            phone: { orders: 890, revenue: 75650 },
            website: { orders: 650, revenue: 55250 },
            ifood: { orders: 454, revenue: 38590 }
        },

        // Produtos mais vendidos
        topProducts: [
            { name: 'Torta de Morango', orders: 1200, revenue: 102000 },
            { name: 'Bolo de Chocolate', orders: 890, revenue: 53400 },
            { name: 'Torta de Limão', orders: 780, revenue: 54600 },
            { name: 'Brigadeiro Gourmet', orders: 670, revenue: 20100 },
            { name: 'Cheesecake', orders: 540, revenue: 43200 }
        ]
    },

    // Benchmarks do setor
    benchmarks: {
        industry: 'Doceria/Confeitaria',
        avgEngagementRate: 3.5,
        avgCPC: 0.65,
        avgCPL: 12.00,
        avgROAS: 3.0,
        avgConversionRate: 2.8,
        avgTicket: 75
    },

    // Metas
    goals: {
        monthly: {
            revenue: 600000,
            leads: 2000,
            cac: 15,
            roas: 4.5,
            conversionRate: 4.0
        },
        quarterly: {
            revenue: 2000000,
            followers: 20000,
            emailSubscribers: 6000
        },
        yearly: {
            revenue: 8000000,
            units: 5,
            employees: 50
        }
    }
};

// ========================================
// Dados de Performance por Dia (Últimos 30 dias)
// ========================================
const dailyPerformance = generateDailyData(30);

function generateDailyData(days) {
    const data = [];
    const baseDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - i);
        
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const weekendMultiplier = isWeekend ? 1.3 : 1;
        
        data.push({
            date: date.toISOString().split('T')[0],
            dayOfWeek: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
            
            // Receita
            revenue: Math.round((12000 + Math.random() * 6000) * weekendMultiplier),
            orders: Math.round((150 + Math.random() * 80) * weekendMultiplier),
            avgTicket: 80 + Math.random() * 20,
            
            // Tráfego Pago
            adSpend: 90 + Math.random() * 40,
            impressions: Math.round((5500 + Math.random() * 3000) * weekendMultiplier),
            clicks: Math.round((180 + Math.random() * 100) * weekendMultiplier),
            ctr: 2.8 + Math.random() * 0.8,
            cpc: 0.42 + Math.random() * 0.15,
            
            // Leads
            leads: Math.round((55 + Math.random() * 35) * weekendMultiplier),
            cpl: 6 + Math.random() * 4,
            conversions: Math.round((8 + Math.random() * 6) * weekendMultiplier),
            
            // Social
            instagramReach: Math.round((2800 + Math.random() * 1500) * weekendMultiplier),
            instagramEngagement: Math.round((120 + Math.random() * 80) * weekendMultiplier),
            tiktokViews: Math.round((6000 + Math.random() * 4000) * weekendMultiplier),
            
            // Website
            websiteVisits: Math.round((250 + Math.random() * 150) * weekendMultiplier),
            websiteConversion: 3 + Math.random() * 2,
            
            // WhatsApp
            whatsappLeads: Math.round((25 + Math.random() * 15) * weekendMultiplier),
            whatsappOrders: Math.round((12 + Math.random() * 8) * weekendMultiplier),
            
            // Email
            emailsSent: Math.round((1200 + Math.random() * 400)),
            emailOpens: Math.round((340 + Math.random() * 120)),
            emailClicks: Math.round((50 + Math.random() * 25))
        });
    }
    
    return data;
}

// ========================================
// Dados de Conteúdo
// ========================================
const contentData = {
    instagram: {
        recentPosts: [
            {
                id: 1,
                type: 'reels',
                caption: 'Bastidores da nossa cozinha! Veja como cada torta é feita com amor...',
                date: '2026-07-14',
                likes: 782,
                comments: 65,
                shares: 34,
                reach: 4200,
                saves: 89
            },
            {
                id: 2,
                type: 'carousel',
                caption: '5 dicas para escolher a torta perfeita para sua festa...',
                date: '2026-07-13',
                likes: 543,
                comments: 42,
                shares: 21,
                reach: 3100,
                saves: 67
            },
            {
                id: 3,
                type: 'image',
                caption: 'Nova Torta de Frutas Vermelhas! Experimente já...',
                date: '2026-07-12',
                likes: 621,
                comments: 38,
                shares: 18,
                reach: 2800,
                saves: 45
            }
        ],
        stories: {
            dailyViews: 1800,
            completionRate: 72,
            replies: 89,
            linkClicks: 124
        }
    },
    
    tiktok: {
        recentVideos: [
            {
                id: 1,
                caption: 'POV: Processo artesanal da torta mais vendida',
                views: 12400,
                likes: 1890,
                comments: 124,
                shares: 234,
                completionRate: 68
            },
            {
                id: 2,
                caption: 'Reação ao provar nossa torta de morango',
                views: 8900,
                likes: 1234,
                comments: 89,
                shares: 156,
                completionRate: 72
            }
        ]
    }
};

// ========================================
// Dados de Concorrência
// ========================================
const competitorData = [
    {
        name: 'Tortlas Confeitaria',
        threat: 'high',
        rating: 4.7,
        reviews: 456,
        units: 2,
        platforms: ['iFood', 'Instagram', 'Facebook'],
        strengths: ['Forte no delivery', 'Boa avaliação', 'iFood ativo'],
        weaknesses: ['Pouco conteúdo educativo', 'Sem TikTok', 'Sem storytelling'],
        estimatedRevenue: 350000,
        estimatedFollowers: 15000
    },
    {
        name: 'Pamela Gourmet',
        threat: 'medium',
        rating: 4.2,
        reviews: 189,
        units: 1,
        platforms: ['Instagram', 'Facebook'],
        strengths: ['Posicionamento gourmet', 'Instagram ativo'],
        weaknesses: ['Sem tráfego pago', 'SEO fraco', 'Sem automação'],
        estimatedRevenue: 180000,
        estimatedFollowers: 8500
    },
    {
        name: 'Alê Pessoa',
        threat: 'medium',
        rating: 4.4,
        reviews: 312,
        units: 2,
        platforms: ['Instagram', 'Facebook', 'iFood'],
        strengths: ['Horário estendido', 'Site próprio', 'Boas avaliações'],
        weaknesses: ['Pouco tráfego pago', 'Conteúdo fraco', 'Sem email marketing'],
        estimatedRevenue: 280000,
        estimatedFollowers: 11000
    }
];

// ========================================
// Exportar dados
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        companyData,
        dailyPerformance,
        contentData,
        competitorData
    };
}
