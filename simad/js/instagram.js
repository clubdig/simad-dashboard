/**
 * SIMAD - Instagram Graph API Integration
 * Conexão direta com Instagram para dados em tempo real
 */

// ========================================
// Instagram API Configuration
// ========================================
const InstagramAPI = {
    baseUrl: 'https://graph.facebook.com/v18.0',
    accessToken: null,
    instagramAccountId: null,
    pageId: null,
    
    // Initialize
    init() {
        this.loadConfig();
        this.checkConnection();
    },
    
    // Load saved config
    loadConfig() {
        const config = localStorage.getItem('simad_instagram_config');
        if (config) {
            const data = JSON.parse(config);
            this.accessToken = data.accessToken;
            this.instagramAccountId = data.instagramAccountId;
            this.pageId = data.pageId;
            return true;
        }
        return false;
    },
    
    // Save config
    saveConfig(accessToken, instagramAccountId, pageId) {
        this.accessToken = accessToken;
        this.instagramAccountId = instagramAccountId;
        this.pageId = pageId;
        
        localStorage.setItem('simad_instagram_config', JSON.stringify({
            accessToken,
            instagramAccountId,
            pageId,
            savedAt: new Date().toISOString()
        }));
    },
    
    // Check if connected
    isConnected() {
        return this.accessToken && this.instagramAccountId;
    },
    
    // Check connection status
    async checkConnection() {
        if (!this.isConnected()) {
            this.updateUI(false);
            return false;
        }
        
        try {
            const data = await this.makeRequest(`/${this.instagramAccountId}`, {
                fields: 'id,username,name,biography,followers_count,follows_count,media_count'
            });
            
            if (data && data.username) {
                this.updateUI(true, data);
                return true;
            }
        } catch (error) {
            console.error('Instagram connection error:', error);
            this.updateUI(false);
        }
        
        return false;
    },
    
    // Make API request
    async makeRequest(endpoint, params = {}) {
        if (!this.accessToken) {
            throw new Error('Access token not configured');
        }
        
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('access_token', this.accessToken);
        
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }
        
        return response.json();
    },
    
    // Get account info
    async getAccountInfo() {
        return this.makeRequest(`/${this.instagramAccountId}`, {
            fields: 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website'
        });
    },
    
    // Get media (posts)
    async getMedia(limit = 12) {
        return this.makeRequest(`/${this.instagramAccountId}/media`, {
            fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count',
            limit: limit
        });
    },
    
    // Get insights (analytics)
    async getInsights(period = 'day', since = null, until = null) {
        const params = {
            metric: 'impressions,reach,profile_views,website_clicks',
            period: period
        };
        
        if (since) params.since = since;
        if (until) params.until = until;
        
        return this.makeRequest(`/${this.instagramAccountId}/insights`, params);
    },
    
    // Get stories insights
    async getStoriesInsights() {
        // Get recent stories media IDs
        const stories = await this.makeRequest(`/${this.instagramAccountId}/stories`, {
            fields: 'id,timestamp',
            limit: 20
        });
        
        if (!stories.data || stories.data.length === 0) {
            return { data: [] };
        }
        
        // Get insights for each story
        const insightsPromises = stories.data.map(story => 
            this.makeRequest(`/${story.id}/insights`, {
                metric: 'impressions,reach,replies,taps_forward,taps_back,exits'
            })
        );
        
        const insightsResults = await Promise.all(insightsPromises);
        
        return {
            data: stories.data.map((story, index) => ({
                ...story,
                insights: insightsResults[index]?.data || []
            }))
        };
    },
    
    // Get audience demographics
    async getAudience() {
        return this.makeRequest(`/${this.instagramAccountId}/insights`, {
            metric: 'audience_city,audience_country,audience_gender_age',
            period: 'lifetime'
        });
    },
    
    // Get all dashboard data
    async getDashboardData() {
        try {
            const [accountInfo, media, insights] = await Promise.all([
                this.getAccountInfo(),
                this.getMedia(12),
                this.getInsights('day')
            ]);
            
            // Process insights data
            const insightsData = {};
            if (insights.data) {
                insights.data.forEach(item => {
                    insightsData[item.name] = item.values[0]?.value || 0;
                });
            }
            
            // Process recent posts
            const recentPosts = media.data?.map(post => ({
                id: post.id,
                type: post.media_type,
                caption: post.caption?.substring(0, 100) + '...' || '',
                image: post.media_url || post.thumbnail_url,
                likes: post.like_count || 0,
                comments: post.comments_count || 0,
                timestamp: post.timestamp,
                permalink: post.permalink
            })) || [];
            
            return {
                account: {
                    id: accountInfo.id,
                    username: accountInfo.username,
                    name: accountInfo.name,
                    biography: accountInfo.biography,
                    followers: accountInfo.followers_count || 0,
                    following: accountInfo.follows_count || 0,
                    mediaCount: accountInfo.media_count || 0,
                    profilePicture: accountInfo.profile_picture_url,
                    website: accountInfo.website
                },
                insights: {
                    impressions: insightsData.impressions || 0,
                    reach: insightsData.reach || 0,
                    profileViews: insightsData.profile_views || 0,
                    websiteClicks: insightsData.website_clicks || 0
                },
                recentPosts: recentPosts,
                lastUpdated: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Error fetching Instagram data:', error);
            throw error;
        }
    },
    
    // Update UI based on connection status
    updateUI(connected, data = null) {
        const statusElements = document.querySelectorAll('.instagram-status');
        statusElements.forEach(el => {
            if (connected) {
                el.className = 'instagram-status connected';
                el.innerHTML = '<i class="fab fa-instagram"></i> Conectado';
            } else {
                el.className = 'instagram-status disconnected';
                el.innerHTML = '<i class="fab fa-instagram"></i> Desconectado';
            }
        });
        
        // Update follower count
        const followersEl = document.getElementById('igFollowers');
        if (followersEl && data) {
            followersEl.textContent = data.followers_count?.toLocaleString('pt-BR') || '0';
        }
        
        // Update username
        const usernameEl = document.getElementById('igUsername');
        if (usernameEl && data) {
            usernameEl.textContent = '@' + data.username;
        }
    },
    
    // Show setup modal
    showSetupModal() {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Conectar Instagram';
        modalBody.innerHTML = `
            <div class="instagram-setup">
                <div class="setup-intro">
                    <div class="instagram-icon-large">
                        <i class="fab fa-instagram"></i>
                    </div>
                    <h4>Conecte seu Instagram ao SIMAD</h4>
                    <p>Para conectar, você precisa criar um aplicativo no Facebook Developer e obter um Access Token.</p>
                </div>
                
                <div class="setup-steps">
                    <h5>Como obter o Access Token:</h5>
                    <ol>
                        <li>
                            <strong>Crie um App no Facebook Developer</strong>
                            <p>Acesse <a href="https://developers.facebook.com" target="_blank">developers.facebook.com</a> e crie um novo aplicativo (tipo: Negócios)</p>
                        </li>
                        <li>
                            <strong>Adicione o produto Instagram Graph API</strong>
                            <p>No painel do app, clique em "Adicionar Produto" e selecione "Instagram Graph API"</p>
                        </li>
                        <li>
                            <strong>Gere o Access Token</strong>
                            <p>Vá em Ferramentas > Explorador da Graph API, selecione seu app e gere o token com as permissões:</p>
                            <ul>
                                <li>instagram_basic</li>
                                <li>instagram_manage_insights</li>
                                <li>pages_show_list</li>
                                <li>pages_read_engagement</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Cole o token abaixo</strong>
                        </li>
                    </ol>
                </div>
                
                <div class="setup-form">
                    <div class="form-group">
                        <label>Access Token</label>
                        <input type="password" id="igAccessToken" placeholder="Cole seu Access Token aqui">
                        <small>O token deve ter as permissões do Instagram Graph API</small>
                    </div>
                    
                    <div class="form-group">
                        <label>ID da Página do Facebook (opcional)</label>
                        <input type="text" id="igPageId" placeholder="Se souber, cole aqui (senão será detectado automaticamente)">
                    </div>
                    
                    <div class="setup-actions">
                        <button class="btn-secondary" onclick="InstagramAPI.testConnection()">
                            <i class="fas fa-vial"></i> Testar Conexão
                        </button>
                        <button class="btn-primary" onclick="InstagramAPI.connect()">
                            <i class="fab fa-instagram"></i> Conectar Instagram
                        </button>
                    </div>
                    
                    <div id="igTestResult" class="test-result" style="display: none;"></div>
                </div>
                
                <div class="setup-security">
                    <p><i class="fas fa-shield-alt"></i> Seus dados estão seguros. O token é armazenado apenas no seu navegador.</p>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    },
    
    // Test connection
    async testConnection() {
        const token = document.getElementById('igAccessToken').value;
        const resultEl = document.getElementById('igTestResult');
        
        if (!token) {
            resultEl.style.display = 'block';
            resultEl.innerHTML = '<p class="error"><i class="fas fa-times-circle"></i> Insira o Access Token</p>';
            return;
        }
        
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Testando conexão...</p>';
        
        try {
            // Temporarily set token for testing
            this.accessToken = token;
            
            // Try to get user info
            const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${token}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            resultEl.innerHTML = `
                <p class="success">
                    <i class="fas fa-check-circle"></i> 
                    Conexão testada com sucesso!<br>
                    <small>Usuário: ${data.name || data.id}</small>
                </p>
            `;
            
        } catch (error) {
            resultEl.innerHTML = `
                <p class="error">
                    <i class="fas fa-times-circle"></i> 
                    Erro na conexão: ${error.message}
                </p>
            `;
            this.accessToken = null;
        }
    },
    
    // Connect with token
    async connect() {
        const token = document.getElementById('igAccessToken').value;
        const pageId = document.getElementById('igPageId').value;
        const resultEl = document.getElementById('igTestResult');
        
        if (!token) {
            resultEl.style.display = 'block';
            resultEl.innerHTML = '<p class="error"><i class="fas fa-times-circle"></i> Insira o Access Token</p>';
            return;
        }
        
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Conectando...</p>';
        
        try {
            this.accessToken = token;
            
            // Get Instagram account ID from token
            const userData = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${token}`);
            const user = await userData.json();
            
            // If page ID provided, get Instagram account from page
            if (pageId) {
                const pageData = await fetch(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${token}`);
                const page = await pageData.json();
                
                if (page.instagram_business_account) {
                    this.instagramAccountId = page.instagram_business_account.id;
                    this.pageId = pageId;
                }
            } else {
                // Try to find Instagram account from pages
                const pagesData = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${token}`);
                const pages = await pagesData.json();
                
                if (pages.data && pages.data.length > 0) {
                    for (const page of pages.data) {
                        if (page.instagram_business_account) {
                            this.instagramAccountId = page.instagram_business_account.id;
                            this.pageId = page.id;
                            break;
                        }
                    }
                }
            }
            
            if (!this.instagramAccountId) {
                throw new Error('Não foi encontrada uma conta do Instagram conectada. Verifique se sua página do Facebook está conectada ao Instagram.');
            }
            
            // Save config
            this.saveConfig(token, this.instagramAccountId, this.pageId);
            
            // Get account info to confirm
            const accountInfo = await this.getAccountInfo();
            
            resultEl.innerHTML = `
                <p class="success">
                    <i class="fas fa-check-circle"></i> 
                    Conectado com sucesso!<br>
                    <small>Conta: @${accountInfo.username} (${accountInfo.followers_count?.toLocaleString('pt-BR') || 0} seguidores)</small>
                </p>
            `;
            
            // Update dashboard
            this.updateUI(true, accountInfo);
            
            // Close modal after delay
            setTimeout(() => {
                closeModal();
                showToast('Instagram conectado com sucesso!');
                
                // Refresh dashboard data
                this.refreshDashboard();
            }, 2000);
            
        } catch (error) {
            resultEl.innerHTML = `
                <p class="error">
                    <i class="fas fa-times-circle"></i> 
                    Erro ao conectar: ${error.message}
                </p>
            `;
        }
    },
    
    // Disconnect
    disconnect() {
        this.accessToken = null;
        this.instagramAccountId = null;
        this.pageId = null;
        
        localStorage.removeItem('simad_instagram_config');
        
        this.updateUI(false);
        showToast('Instagram desconectado');
    },
    
    // Refresh dashboard with Instagram data
    async refreshDashboard() {
        if (!this.isConnected()) return;
        
        try {
            const data = await this.getDashboardData();
            
            // Update KPIs
            document.getElementById('igFollowers').textContent = 
                data.account.followers.toLocaleString('pt-BR');
            
            document.getElementById('igReach').textContent = 
                data.insights.reach.toLocaleString('pt-BR');
            
            document.getElementById('igImpressions').textContent = 
                data.insights.impressions.toLocaleString('pt-BR');
            
            document.getElementById('igProfileViews').textContent = 
                data.insights.profileViews.toLocaleString('pt-BR');
            
            document.getElementById('igWebsiteClicks').textContent = 
                data.insights.websiteClicks.toLocaleString('pt-BR');
            
            // Update recent posts
            this.updateRecentPosts(data.recentPosts);
            
            // Save to localStorage for offline use
            localStorage.setItem('simad_instagram_data', JSON.stringify(data));
            
            console.log('Instagram data refreshed:', data);
            
        } catch (error) {
            console.error('Error refreshing Instagram data:', error);
        }
    },
    
    // Update recent posts UI
    updateRecentPosts(posts) {
        const container = document.getElementById('igRecentPosts');
        if (!container || !posts) return;
        
        container.innerHTML = posts.map(post => `
            <div class="post-item">
                <img src="${post.image}" alt="Post" class="post-image">
                <div class="post-info">
                    <span class="post-type">${post.type}</span>
                    <p class="post-caption">${post.caption}</p>
                    <div class="post-stats">
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                        <span><i class="fas fa-comment"></i> ${post.comments}</span>
                    </div>
                    <span class="post-date">${new Date(post.timestamp).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
        `).join('');
    },
    
    // Auto-refresh every 5 minutes
    startAutoRefresh() {
        setInterval(() => {
            if (this.isConnected()) {
                this.refreshDashboard();
            }
        }, 300000); // 5 minutes
    }
};

// ========================================
// Initialize Instagram API
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    InstagramAPI.init();
    
    if (InstagramAPI.isConnected()) {
        InstagramAPI.startAutoRefresh();
    }
});

// ========================================
// CSS for Instagram Setup
// ========================================
const instagramStyles = document.createElement('style');
instagramStyles.textContent = `
    .instagram-setup {
        max-width: 600px;
    }
    
    .setup-intro {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .instagram-icon-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
    }
    
    .instagram-icon-large i {
        font-size: 2.5rem;
        color: white;
    }
    
    .setup-intro h4 {
        margin-bottom: 0.5rem;
    }
    
    .setup-intro p {
        color: var(--text-secondary);
    }
    
    .setup-steps {
        background: var(--bg-dark);
        padding: 1.5rem;
        border-radius: var(--border-radius-sm);
        margin-bottom: 1.5rem;
    }
    
    .setup-steps h5 {
        margin-bottom: 1rem;
        color: var(--primary-light);
    }
    
    .setup-steps ol {
        padding-left: 1.25rem;
    }
    
    .setup-steps li {
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }
    
    .setup-steps li strong {
        color: var(--text-primary);
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .setup-steps ul {
        margin-top: 0.5rem;
        padding-left: 1.25rem;
    }
    
    .setup-steps a {
        color: var(--primary-light);
    }
    
    .setup-form {
        margin-bottom: 1.5rem;
    }
    
    .setup-form small {
        display: block;
        margin-top: 0.25rem;
        color: var(--text-muted);
        font-size: 0.8rem;
    }
    
    .setup-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .test-result {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: var(--border-radius-sm);
    }
    
    .test-result .success {
        color: var(--secondary);
        background: rgba(16, 185, 129, 0.1);
        padding: 1rem;
        border-radius: var(--border-radius-sm);
    }
    
    .test-result .error {
        color: var(--danger);
        background: rgba(239, 68, 68, 0.1);
        padding: 1rem;
        border-radius: var(--border-radius-sm);
    }
    
    .test-result .loading {
        color: var(--primary);
        background: rgba(99, 102, 241, 0.1);
        padding: 1rem;
        border-radius: var(--border-radius-sm);
    }
    
    .setup-security {
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .setup-security p {
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    
    .setup-security i {
        color: var(--secondary);
    }
    
    .instagram-status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
    }
    
    .instagram-status.connected {
        background: rgba(16, 185, 129, 0.15);
        color: var(--secondary);
    }
    
    .instagram-status.disconnected {
        background: rgba(239, 68, 68, 0.15);
        color: var(--danger);
    }
    
    .post-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-dark);
        border-radius: var(--border-radius-sm);
        margin-bottom: 0.5rem;
    }
    
    .post-image {
        width: 80px;
        height: 80px;
        border-radius: var(--border-radius-sm);
        object-fit: cover;
    }
    
    .post-info {
        flex: 1;
    }
    
    .post-type {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--primary);
        font-weight: 500;
    }
    
    .post-caption {
        font-size: 0.9rem;
        margin: 0.25rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .post-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    
    .post-stats i {
        margin-right: 0.25rem;
    }
    
    .post-date {
        font-size: 0.8rem;
        color: var(--text-muted);
    }
`;
document.head.appendChild(instagramStyles);
