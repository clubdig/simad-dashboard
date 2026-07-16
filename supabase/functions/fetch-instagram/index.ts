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

    // Buscar dados do Instagram via Viralist
    const response = await fetch('https://viralist.ai/instagram/creators/alicetortas')
    const html = await response.text()
    
    // Extrair dados do HTML (simplificado - em produção usar regex mais robusto)
    const followersMatch = html.match(/(\d+\.?\d*)[Kk]?\s*followers/i)
    const postsMatch = html.match(/(\d+\.?\d*)[Kk]?\s*posts/i)
    const followingMatch = html.match(/(\d+\.?\d*)[Kk]?\s*following/i)
    
    // Converter para números
    let followers = 0
    let posts = 0
    let following = 0
    
    if (followersMatch) {
      const val = followersMatch[1].replace('.', '')
      followers = val.includes('K') ? parseFloat(val) * 1000 : parseInt(val)
    }
    if (postsMatch) {
      const val = postsMatch[1].replace('.', '')
      posts = val.includes('K') ? parseFloat(val) * 1000 : parseInt(val)
    }
    if (followingMatch) {
      const val = followingMatch[1].replace('.', '')
      following = val.includes('K') ? parseFloat(val) * 1000 : parseInt(val)
    }

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { followers, posts, following },
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
