const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  return url.replace(/\/+$/, '');
}

interface ShopifyVariant {
  price: string;
}
interface ShopifyImage {
  src: string;
}
interface ShopifyProduct {
  title: string;
  vendor?: string;
  product_type?: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  handle: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'URL gerekli' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = normalizeUrl(url);
    const productsUrl = `${baseUrl}/products.json?limit=100`;

    const res = await fetch(productsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KHELL-AI-StoreSpy/1.0)' },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Bu mağaza Shopify değil ya da erişilemiyor. Şu an sadece Shopify mağazaları destekleniyor.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const products: ShopifyProduct[] = data?.products || [];

    if (products.length === 0) {
      return new Response(JSON.stringify({ error: 'Ürün bulunamadı' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = products.map((p) => {
      const price = parseFloat(p.variants?.[0]?.price || '0');
      return {
        name: p.title,
        vendor: p.vendor || '',
        category: p.product_type || '',
        price,
        image: p.images?.[0]?.src || '',
        url: `${baseUrl}/products/${p.handle}`,
      };
    }).filter((p) => p.price > 0);

    const totalProducts = parsed.length;
    const avgPrice = totalProducts > 0 ? parsed.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const categoryCounts: Record<string, number> = {};
    parsed.forEach((p) => {
      const cat = p.category || 'Diğer';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    const topProducts = [...parsed].sort((a, b) => b.price - a.price).slice(0, 20);

    return new Response(
      JSON.stringify({
        storeUrl: baseUrl,
        totalProducts,
        avgPrice: avgPrice.toFixed(2),
        topCategory,
        products: topProducts,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
