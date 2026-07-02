const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const key = Deno.env.get('RAPIDAPI_KEY');
    if (!key) throw new Error('RAPIDAPI_KEY not configured');
    const { keyword } = await req.json();
    if (typeof keyword !== 'string' || !keyword.trim()) {
      return new Response(JSON.stringify({ error: 'keyword required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const url = `https://aliexpress-business-api.p.rapidapi.com/textsearch.php?keyWord=${encodeURIComponent(keyword)}&pageSize=20&pageIndex=1&country=TR&currency=USD&lang=en&filter=orders&sortBy=asc`;
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'aliexpress-business-api.p.rapidapi.com',
        'x-rapidapi-key': key,
      },
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