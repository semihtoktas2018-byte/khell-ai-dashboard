import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CJ_EMAIL = 'bamir.global@gmail.com';
const CJ_API_KEY = '26689fbeeb5045f89ec8764c32aaada0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token;
  const res = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY }),
  });
  const data = await res.json();
  if (!data?.data?.accessToken) throw new Error(data?.message || 'CJ token alınamadı');
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

async function getCurrentPrice(pid: string, token: string): Promise<number | null> {
  try {
    const url = `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${pid}`;
    const res = await fetch(url, { headers: { 'CJ-Access-Token': token } });
    const data = await res.json();
    const price = data?.data?.sellPrice ?? data?.data?.list?.[0]?.sellPrice;
    return price ? parseFloat(price) : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: tracked, error: fetchErr } = await supabase
      .from('tracked_products')
      .select('*');

    if (fetchErr) throw fetchErr;
    if (!tracked || tracked.length === 0) {
      return new Response(JSON.stringify({ checked: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = await getAccessToken();
    let checked = 0;
    let alertsCreated = 0;

    for (const item of tracked) {
      const currentPrice = await getCurrentPrice(item.pid, token);
      checked++;
      if (currentPrice === null) continue;

      const oldPrice = Number(item.last_checked_price);
      const diff = Math.abs(currentPrice - oldPrice);
      const changePct = oldPrice > 0 ? (diff / oldPrice) * 100 : 0;

      // %2'den fazla fark varsa bildirim oluştur
      if (changePct >= 2) {
        await supabase.from('price_alerts').insert({
          user_id: item.user_id,
          tracked_product_id: item.id,
          product_name: item.product_name,
          old_price: oldPrice,
          new_price: currentPrice,
          change_pct: currentPrice > oldPrice ? changePct : -changePct,
        });
        alertsCreated++;

        await supabase
          .from('tracked_products')
          .update({ last_checked_price: currentPrice, updated_at: new Date().toISOString() })
          .eq('id', item.id);
      }
    }

    return new Response(JSON.stringify({ checked, alertsCreated }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
