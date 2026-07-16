import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      errors: [] as string[]
    }

    // 1. Buscar Instagram via i.instagram.com API (público)
    try {
      // Usar API pública do Instagram (sem autenticação)
      const igResponse = await fetch('https://i.instagram.com/api/v1/users/web_profile_info/?username=alicetortas', {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'X-IG-App-ID': '936619743392459'
        }
      })
      
      if (igResponse.ok) {
        const igData = await igResponse.json()
        const user = igData.data?.user
        
        if (user) {
          const followers = user.edge_followed_by?.count || 0
          const posts = user.edge_owner_to_timeline_media?.count || 0
          const following = user.edge_follow?.count || 0
          
          results.instagram = { followers, posts, following }

          // Atualizar no Supabase
          const updates = [
            { platform: 'instagram', metric_name: 'followers', metric_value: followers.toString() },
            { platform: 'instagram', metric_name: 'posts', metric_value: posts.toString() },
            { platform: 'instagram', metric_name: 'following', metric_value: following.toString() },
          ]

          for (const update of updates) {
            await supabase
              .from('dashboard_data')
              .upsert(update, { onConflict: 'platform,metric_name' })
          }
        }
      } else {
        results.errors.push(`Instagram API: ${igResponse.status}`)
      }
    } catch (e) {
      results.errors.push(`Instagram: ${e.message}`)
    }

    // 2. Buscar dados do iFood via scraping simples
    try {
      const ifoodResponse = await fetch('https://www.ifood.com.br/delivery/joao-pessoa-pb/alice-werlang---bessa-jardim-oceania/3cf56f8a-8cab-4e77-a273-b58a0bc3ef98', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      
      if (ifoodResponse.ok) {
        const ifoodHtml = await ifoodResponse.text()
        
        // Extrair rating
        const ratingMatch = ifoodHtml.match(/"ratingValue":\s*([\d.]+)/)
        if (ratingMatch) {
          const rating = parseFloat(ratingMatch[1])
          await supabase
            .from('dashboard_data')
            .upsert({ 
              platform: 'ifood', 
              metric_name: 'rating', 
              metric_value: rating.toString() 
            }, { onConflict: 'platform,metric_name' })
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
