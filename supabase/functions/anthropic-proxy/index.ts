import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kullanıcı başına günlük istek limiti (UTC günü). AI_DAILY_LIMIT secret'ı ile değiştirilebilir.
const DAILY_LIMIT = Number(Deno.env.get('AI_DAILY_LIMIT') ?? '30');

// Sadece uygulamanın kullandığı modeller + token tavanı: başka model / uzun çıktı ile fatura şişirilemesin.
const ALLOWED_MODELS = ['claude-haiku-4-5', 'claude-haiku-4-5-20251001', 'claude-sonnet-4-6', 'claude-sonnet-5'];
const MAX_TOKENS_CAP = 2000;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const key = Deno.env.get('ANTHROPIC_API_KEY');
    if (!key) throw new Error('ANTHROPIC_API_KEY not configured');

    // 1) Giriş kontrolü: geçerli bir Supabase Auth oturumu (kullanıcı JWT'si) şart.
    // Public anon/publishable key bir kullanıcıya ait değil → getUser hata verir → 401.
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'unauthorized' }, 401);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userErr || !user) return json({ error: 'unauthorized' }, 401);

    // 2) Gövde doğrulaması (kota harcanmadan önce).
    const body = await req.json();
    if (!body || typeof body !== 'object' || !ALLOWED_MODELS.includes(body.model)) {
      return json({ error: 'model not allowed' }, 400);
    }
    body.max_tokens = Math.min(Number(body.max_tokens) || 1000, MAX_TOKENS_CAP);
    delete body.stream;

    // 3) Günlük limit: sayaç Supabase'de, kullanıcının app_metadata.ai_usage alanında.
    // app_metadata'yı kullanıcı kendisi değiştiremez; sadece service role yazabilir.
    const today = new Date().toISOString().slice(0, 10);
    const usage = (user.app_metadata?.ai_usage ?? {}) as { day?: string; count?: number };
    const used = usage.day === today ? Number(usage.count) || 0 : 0;
    if (used >= DAILY_LIMIT) {
      return json({ error: 'daily limit reached', limit: DAILY_LIMIT }, 429);
    }
    const { error: updErr } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, ai_usage: { day: today, count: used + 1 } },
    });
    if (updErr) throw new Error('usage counter update failed');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
