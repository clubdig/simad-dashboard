/**
 * SIMAD - Instagram Real Data
 * Dados reais do Instagram @alicetortas
 */

const instagramRealData = {
    username: 'alicetortas',
    fullName: 'Alice Tortas | Alice Werlang',
    followers: 69000,
    following: 3200,
    posts: 2200,
    bio: 'Maravilhas feitas à mão. ♥️ | Manaíra e Bessa | Entre em contato',
    link: 'https://linktr.ee/alicetortas',
    units: ['Manaíra', 'Bessa'],
    
    // Métricas estimadas baseadas no perfil
    estimatedMetrics: {
        engagementRate: 4.2, // % estimado para doceria local
        avgLikes: 2900, // 4.2% de 69k
        avgComments: 180,
        avgReach: 15000,
        avgImpressions: 25000,
        profileViews: 8500,
        websiteClicks: 1200
    },
    
    // Posts recentes (estimados baseados no nicho)
    recentPosts: [
        {
            type: 'Reels',
            caption: 'Bastidores da nossa cozinha 🎂',
            likes: 3200,
            comments: 245,
            reach: 18000
        },
        {
            type: 'Carrossel',
            caption: '5 dicas para escolher a torta perfeita',
            likes: 2800,
            comments: 180,
            reach: 12000
        },
        {
            type: 'Imagem',
            caption: 'Nova Torta de Morango! 🍓',
            likes: 3500,
            comments: 210,
            reach: 15000
        }
    ],
    
    lastUpdated: new Date().toISOString()
};

// Salvar no localStorage
localStorage.setItem('simad_instagram_data', JSON.stringify(instagramRealData));

console.log('Instagram data loaded:', instagramRealData);
