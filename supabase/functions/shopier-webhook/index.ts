import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Shopier posts application/x-www-form-urlencoded, but also accept JSON.
    const contentType = req.headers.get('content-type') ?? ''
    let data: Record<string, string> = {}

    if (contentType.includes('application/json')) {
      data = await req.json()
    } else {
      const form = await req.formData()
      form.forEach((v, k) => { data[k] = String(v) })
    }

    console.log('shopier-webhook payload:', data)

    const buyerEmail = (data.buyer_email || data.email || '').toString().trim().toLowerCase()
    const status = (data.status || data.payment_status || '').toString().toLowerCase()

    if (!buyerEmail) {
      return new Response(JSON.stringify({ error: 'buyer_email missing' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const isSuccess = status === 'success' || status === 'successful' || status === 'ok' || status === '1' || status === 'true'
    if (!isSuccess) {
      return new Response(JSON.stringify({ ok: true, skipped: 'payment not success', status }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ plan: 'pro' })
      .eq('email', buyerEmail)
      .select('id, email, plan')

    if (error) {
      console.error('update error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('upgraded to pro:', updated)

    return new Response(JSON.stringify({ ok: true, upgraded: updated?.length ?? 0 }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('shopier-webhook error:', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})