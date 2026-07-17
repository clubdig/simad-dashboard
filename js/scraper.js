// Scraper de dados via CORS proxy
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

// Buscar via CORS proxy
async function fetchWithProxy(url) {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url));
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      continue;
    }
  }
  throw new Error('Todos os proxies falharam');
}

// Extrair dados do Instagram do HTML
function extractInstagramData(html) {
  let followers = 0, posts = 0, following = 0;
  
  // Padrões diferentes para extrair dados
  const patterns = {
    followers: [
      /"edge_followed_by":\{"count":(\d+)\}/,
      /followers["':]+\s*["']?(\d[\d.,]*[KkMm]?)/i,
      /(\d[\d.,]*[KkMm]?)\s*seguidores/i,
      /(\d[\d.,]*[KkMm]?)\s*followers/i
    ],
    posts: [
      /"edge_owner_to_timeline_media":\{"count":(\d+)/,
      /posts["':]+\s*["']?(\d[\d.,]*[KkMm]?)/i,
      /(\d[\d.,]*[KkMm]?)\s*posts/i,
      /(\d[\d.,]*[KkMm]?)\s*publicações/i
    ],
    following: [
      /"edge_follow":\{"count":(\d+)\}/,
      /following["':]+\s*["']?(\d[\d.,]*[KkMm]?)/i,
      /(\d[\d.,]*[KkMm]?)\s*seguindo/i,
      /(\d[\d.,]*[KkMm]?)\s*following/i
    ]
  };
  
  for (const [key, regs] of Object.entries(patterns)) {
    for (const reg of regs) {
      const match = html.match(reg);
      if (match) {
        let val = match[1].replace(/[.,]/g, '');
        if (match[2]) {
          const m = match[2].toLowerCase();
          if (m === 'k' || m === 'mil') val = String(parseFloat(match[1].replace(',', '.')) * 1000);
          if (m === 'm') val = String(parseFloat(match[1].replace(',', '.')) * 1000000);
        }
        if (key === 'followers') followers = parseInt(val) || 0;
        if (key === 'posts') posts = parseInt(val) || 0;
        if (key === 'following') following = parseInt(val) || 0;
        break;
      }
    }
  }
  
  return { followers, posts, following };
}

// Extrair dados do Facebook
function extractFacebookData(html) {
  let followers = 0;
  const patterns = [
    /"followersCount":(\d+)/,
    /"follower_count":(\d+)/,
    /(\d[\d.,]*[KkMm]?)\s*seguidores/i,
    /(\d[\d.,]*[KkMm]?)\s*followers/i
  ];
  
  for (const reg of patterns) {
    const match = html.match(reg);
    if (match) {
      let val = match[1].replace(/[.,]/g, '');
      if (match[2]) {
        const m = match[2].toLowerCase();
        if (m === 'k' || m === 'mil') val = String(parseFloat(match[1].replace(',', '.')) * 1000);
      }
      followers = parseInt(val) || 0;
      break;
    }
  }
  
  return { followers };
}

// Extrair dados do TikTok
function extractTikTokData(html) {
  let followers = 0;
  const patterns = [
    /"followerCount":(\d+)/,
    /"fans":(\d+)/,
    /(\d[\d.,]*[KkMm]?)\s*seguidores/i,
    /(\d[\d.,]*[KkMm]?)\s*followers/i
  ];
  
  for (const reg of patterns) {
    const match = html.match(reg);
    if (match) {
      let val = match[1].replace(/[.,]/g, '');
      followers = parseInt(val) || 0;
      break;
    }
  }
  
  return { followers };
}

// Extrair dados do iFood
function extractIFoodData(html) {
  let rating = 0;
  const patterns = [
    /"ratingValue":\s*([\d.]+)/,
    /(\d\.\d)\s*estrela/i,
    /nota\s*([\d.,]+)/i
  ];
  
  for (const reg of patterns) {
    const match = html.match(reg);
    if (match) {
      rating = parseFloat(match[1].replace(',', '.')) || 0;
      break;
    }
  }
  
  return { rating };
}

// Função principal de scraping
async function scrapeAllData() {
  const results = {
    instagram: null,
    facebook: null,
    tiktok: null,
    ifood: null,
    errors: []
  };
  
  // Instagram
  try {
    const html = await fetchWithProxy('https://www.instagram.com/alicetortas/');
    results.instagram = extractInstagramData(html);
  } catch (e) {
    results.errors.push('Instagram: ' + e.message);
  }
  
  // Facebook
  try {
    const html = await fetchWithProxy('https://www.facebook.com/alicetortas/');
    results.facebook = extractFacebookData(html);
  } catch (e) {
    results.errors.push('Facebook: ' + e.message);
  }
  
  // TikTok
  try {
    const html = await fetchWithProxy('https://www.tiktok.com/@alice_tortas');
    results.tiktok = extractTikTokData(html);
  } catch (e) {
    results.errors.push('TikTok: ' + e.message);
  }
  
  // iFood
  try {
    const html = await fetchWithProxy('https://www.ifood.com.br/delivery/joao-pessoa-pb/alice-werlang---bessa-jardim-oceania/3cf56f8a-8cab-4e77-a273-b58a0bc3ef98');
    results.ifood = extractIFoodData(html);
  } catch (e) {
    results.errors.push('iFood: ' + e.message);
  }
  
  return results;
}

// Exportar
window.ScraperIntegration = {
  scrape: scrapeAllData
};
