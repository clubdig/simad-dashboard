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

    // 1. Buscar Instagram via Viralist
    try {
      const igResponse = await fetch('https://viralist.ai/instagram/creators/alicetortas', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      const igHtml = await igResponse.text()
      
      // Extrair dados - padrão: "69.0Kfollowers" ou "69,000 followers"
      const followersMatch = igHtml.match(/([\d,.]+[KkMm]?)\s*followers/i)
      const postsMatch = igHtml.match(/([\d,.]+[KkMm]?)\s*posts/i)
      const followingMatch = igHtml.match(/([\d,.]+[KkMm]?)\s*following/i)
      
      let followers = 0
      let posts = 0
      let following = 0
      
      if (followersMatch) {
        let val = followersMatch[1].replace(/,/g, '')
        if (val.includes('K') || val.includes('k')) {
          followers = parseFloat(val) * 1000
        } else if (val.includes('M') || val.includes('m')) {
          followers = parseFloat(val) * 1000000
        } else {
          followers = parseInt(val)
        }
      }
      
      if (postsMatch) {
        let val = postsMatch[1].replace(/,/g, '')
        if (val.includes('K') || val.includes('k')) {
          posts = parseFloat(val) * 1000
        } else {
          posts = parseInt(val)
        }
      }
      
      if (followingMatch) {
        let val = followingMatch[1].replace(/,/g, '')
        if (val.includes('K') || val.includes('k')) {
          following = parseFloat(val) * 1000
        } else {
          following = parseInt(val)
        }
      }

      results.instagram = { followers, posts, following }

      // Atualizar no Supabase
      const updates = [
        { platform: 'instagram', metric_name: 'followers', metric_value: Math.round(followers).toString() },
        { platform: 'instagram', metric_name: 'posts', metric_value: Math.round(posts).toString() },
        { platform: 'instagram', metric_name: 'following', metric_value: Math.round(following).toString() },
      ]

      for (const update of updates) {
        await supabase
          .from('dashboard_data')
          .upsert(update, { onConflict: 'platform,metric_name' })
      }
    } catch (e) {
      results.errors.push(`Instagram: ${e.message}`)
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
