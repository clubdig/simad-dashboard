import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para extrair números de texto
function extractNumbers(text: string): { followers: number, posts: number, following: number } {
  let followers = 0, posts = 0, following = 0
  
  // Padrões para followers
  const followersPatterns = [
    /(\d+[\.,]?\d*)\s*(mil|k|m)\s*seguidores/i,
    /(\d+[\.,]?\d*)\s*followers/i,
    /"edge_followed_by":\{"count":(\d+)\}/,
    /followers_count["':]+\s*(\d+)/i
  ]
  
  // Padrões para posts
  const postsPatterns = [
    /(\d+[\.,]?\d*)\s*posts/i,
    /"edge_owner_to_timeline_media":\{"count":(\d+)/,
    /posts_count["':]+\s*(\d+)/i
  ]
  
  // Padrões para following
  const followingPatterns = [
    /(\d+[\.,]?\d*)\s*seguindo/i,
    /(\d+[\.,]?\d*)\s*following/i,
    /"edge_follow":\{"count":(\d+)\}/,
    /following_count["':]+\s*(\d+)/i
  ]
  
  for (const pattern of followersPatterns) {
    const match = text.match(pattern)
    if (match) {
      let val = match[1].replace(/[,\.]/g, '')
      if (match[2]) {
        const multiplier = match[2].toLowerCase()
        if (multiplier === 'mil' || multiplier === 'k') val = (parseFloat(match[1].replace(',', '.')) * 1000).toString()
        if (multiplier === 'm') val = (parseFloat(match[1].replace(',', '.')) * 1000000).toString()
      }
      followers = parseInt(val)
      break
    }
  }
  
  for (const pattern of postsPatterns) {
    const match = text.match(pattern)
    if (match) {
      posts = parseInt(match[1].replace(/[,\.]/g, ''))
      break
    }
  }
  
  for (const pattern of followingPatterns) {
    const match = text.match(pattern)
    if (match) {
      let val = match[1].replace(/[,\.]/g, '')
      if (match[2]) {
        const multiplier = match[2].toLowerCase()
        if (multiplier === 'mil' || multiplier === 'k') val = (parseFloat(match[1].replace(',', '.')) * 1000).toString()
      }
      following = parseInt(val)
      break
    }
  }
  
  return { followers, posts, following }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const results = {
      instagram: null as any,
      ifood: null as any,
      errors: [] as string[]
    }

    // 1. Buscar Instagram via múltiplas fontes
    const igSources = [
      'https://www.instagram.com/alicetortas/',
      'https://i.instagram.com/api/v1/users/web_profile_info/?username=alicetortas'
    ]
    
    for (const source of igSources) {
      try {
        const response = await fetch(source, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
          }
        })
        
        if (response.ok) {
          const text = await response.text()
          const data = extractNumbers(text)
          
          if (data.followers > 0) {
            results.instagram = data
            
            // Atualizar no Supabase
            await supabase.from('dashboard_data').upsert([
              { platform: 'instagram', metric_name: 'followers', metric_value: data.followers.toString() },
              { platform: 'instagram', metric_name: 'posts', metric_value: data.posts.toString() },
              { platform: 'instagram', metric_name: 'following', metric_value: data.following.toString() },
            ], { onConflict: 'platform,metric_name' })
            
            break
          }
        }
      } catch (e) {
        results.errors.push(`Instagram ${source}: ${e.message}`)
      }
    }

    // 2. Buscar iFood
    try {
      const ifoodResponse = await fetch('https://www.ifood.com.br/delivery/joao-pessoa-pb/alice-werlang---bessa-jardim-oceania/3cf56f8a-8cab-4e77-a273-b58a0bc3ef98', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      
      if (ifoodResponse.ok) {
        const ifoodHtml = await ifoodResponse.text()
        const ratingMatch = ifoodHtml.match(/"ratingValue":\s*([\d.]+)/) || ifoodHtml.match(/(\d\.\d)\s*estrela/i)
        
        if (ratingMatch) {
          const rating = parseFloat(ratingMatch[1])
          results.ifood = { rating }
          
          await supabase.from('dashboard_data').upsert([
            { platform: 'ifood', metric_name: 'rating', metric_value: rating.toString() }
          ], { onConflict: 'platform,metric_name' })
        }
      }
    } catch (e) {
      results.errors.push(`iFood: ${e.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
