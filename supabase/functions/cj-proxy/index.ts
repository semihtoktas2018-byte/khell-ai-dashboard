const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token;
  const email = Deno.env.get('CJ_EMAIL');
  const password = Deno.env.get('CJ_API_KEY');
  if (!email || !password) throw new Error('CJ credentials not configured');
  const res = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data?.data?.accessToken) throw new Error(data?.message || 'CJ token error');
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { path, query } = await req.json();
    if (typeof path !== 'string' || !path.startsWith('/api2.0/v1/')) {
      return new Response(JSON.stringify({ error: 'invalid path' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = await getAccessToken();
    const qs = query ? '?' + new URLSearchParams(query as Record<string, string>).toString() : '';
    const res = await fetch(`https://developers.cjdropshipping.com${path}${qs}`, {
      headers: { 'CJ-Access-Token': token },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});