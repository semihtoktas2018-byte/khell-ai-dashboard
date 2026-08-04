import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// Shopier signature: HMAC-SHA256(key=SHOPIER_API_SECRET, message=random_nr+platform_order_id), base64-encoded.
async function computeShopierSignature(randomNr: string, platformOrderId: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(randomNr + platformOrderId))
  return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
}

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

    const randomNr = String(data.random_nr ?? '')
    const platformOrderId = String(data.platform_order_id ?? '')
    const receivedSignature = String(data.signature ?? '')

    const shopierSecret = Deno.env.get('SHOPIER_API_SECRET')
    if (!shopierSecret) {
      console.error('shopier-webhook error: SHOPIER_API_SECRET not configured')
      return new Response(JSON.stringify({ error: 'SHOPIER_API_SECRET not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!randomNr || !platformOrderId || !receivedSignature) {
      return new Response(JSON.stringify({ error: 'missing signature fields' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const expectedSignature = await computeShopierSignature(randomNr, platformOrderId, shopierSecret)
    if (expectedSignature !== receivedSignature) {
      console.error('shopier-webhook error: invalid signature')
      return new Response(JSON.stringify({ error: 'invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

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