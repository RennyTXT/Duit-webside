/**
 * DUIT Overseas Product Scraper + Supabase Importer
 *
 * Usage:
 *   node scripts/scrape-duit.js           → scrape + save scraped.json
 *   node scripts/scrape-duit.js --import  → scrape + import to Supabase
 *
 * Note: duitoverseas.com does not display prices publicly (B2B portal).
 *       Prices will be set to 0. Update them via the admin panel after import.
 *
 * Requirements: npm install puppeteer @supabase/supabase-js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://tupvzkekyzgxhwagrvgl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rVdoP5SZzmIgTCCiKwWepg_T9qB3rLR';
const BASE_URL = 'https://duitoverseas.com/shop_view';
const OUTPUT_FILE = path.join(__dirname, 'scraped.json');

const PRODUCT_IDS = [
  289, 296, 246, 276, 103, 101, 275, 249, 288, 300, 257, 91, 118,
  299, 298, 297, 295, 290, 292, 293, 114, 178, 201, 132, 274, 272,
  204, 130, 277, 148, 81, 287, 285, 185, 269, 284, 283, 256, 280,
  251, 261, 279, 278, 240, 252, 265, 188, 245, 186, 40, 260, 137,
  273, 263, 262, 259, 266, 267, 147, 268, 193, 111, 242, 270, 113,
  258, 10, 264, 195, 197
];

// Map imweb breadcrumb names → our DB categories
const CATEGORY_MAP = {
  'eat/drink': 'eat-drink',
  'eatdrink': 'eat-drink',
  'waterpot': 'eat-drink',
  'furniture': 'furniture',
  'dryhouse': 'furniture',
  'play&rest': 'play-rest',
  'playandrest': 'play-rest',
  'play and rest': 'play-rest',
  'potty': 'hygiene',
  'bath': 'hygiene',
  'daily': 'daily',
  'accessory': 'daily',
  'accessories': 'daily',
  'travel': 'travel',
  'labproduct': 'daily',
};

function mapCategory(breadcrumbName) {
  if (!breadcrumbName) return 'daily';
  const key = breadcrumbName.toLowerCase().trim();
  return CATEGORY_MAP[key] || 'daily';
}

// ─── Scraper ─────────────────────────────────────────────────────────────────
async function scrapePage(page, productId) {
  const url = `${BASE_URL}/${productId}`;

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    const data = await page.evaluate((productId) => {
      // Parse all JSON-LD schemas
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map(s => { try { return JSON.parse(s.textContent); } catch(e) { return null; } })
        .filter(Boolean);

      // Product schema
      const product = schemas.find(s => s['@type'] === 'Product') || {};
      // BreadcrumbList schema
      const breadcrumb = schemas.find(s => s['@type'] === 'BreadcrumbList');

      // Extract category from breadcrumb position 2
      let categoryRaw = '';
      if (breadcrumb && breadcrumb.itemListElement) {
        const pos2 = breadcrumb.itemListElement.find(el => el.position === 2);
        if (pos2) categoryRaw = pos2.name || '';
      }

      // Images from Product schema (highest quality)
      const schemaImages = Array.isArray(product.image)
        ? product.image
        : (product.image ? [product.image] : []);

      // Also collect large images from page (>w=400 thumbnails)
      const pageImages = new Set();
      document.querySelectorAll('img[src*="imweb.me"]').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (
          src &&
          !src.includes('icon') &&
          !src.includes('logo') &&
          !src.includes('thumb/') &&
          src.includes('upload')
        ) {
          pageImages.add(src);
        }
      });

      // Merge schema images + page images (schema first)
      const allImages = [...new Set([...schemaImages, ...pageImages])];

      // Tagline from .goods_summary
      const summary = document.querySelector('.goods_summary');
      const tagline = summary ? summary.textContent.trim().slice(0, 200) : '';

      // Name from schema or page title
      const name = product.name || document.title || '';

      // Description from schema
      const description = (product.description || tagline || '').slice(0, 1000);

      // Badges (is_new, is_best)
      const badgeText = document.body.textContent.toLowerCase();
      const pageUrl = window.location.href;

      return {
        name: name.trim(),
        tagline: tagline.slice(0, 200),
        description: description.trim(),
        images: allImages,
        image_url: allImages[0] || '',
        categoryRaw,
        is_new: badgeText.includes('new arrival') || badgeText.includes('신상품'),
        is_best: badgeText.includes('best seller') || badgeText.includes('bestseller'),
        sourceId: productId,
      };
    }, productId);

    return {
      id: randomUUID(),
      sku: `DUIT${String(productId).padStart(4, '0')}`, // keep for reference
      name: data.name,
      price: 0, // duitoverseas.com does not display prices — set via admin
      category: mapCategory(data.categoryRaw),
      tagline: data.tagline,
      description: data.description,
      features: [],
      specs: [],
      is_new: data.is_new,
      is_best: data.is_best,
      image_url: data.image_url,
      images: data.images,
      model_url: '',
      _categoryRaw: data.categoryRaw, // debug
    };
  } catch (err) {
    console.error(`  ✗ Failed ${productId}: ${err.message}`);
    return null;
  }
}

// ─── Supabase Import ──────────────────────────────────────────────────────────
async function importToSupabase(products) {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(`\n📦 Importing ${products.length} products to Supabase...\n`);
  let success = 0;
  let failed = 0;

  for (const product of products) {
    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      tagline: product.tagline || '',
      description: product.description || '',
      features: product.features || [],
      specs: product.specs || [],
      is_new: product.is_new || false,
      is_best: product.is_best || false,
      image_url: product.image_url || '',
      images: product.images || [],
      model_url: product.model_url || '',
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error(`  ✗ ${product.id} (${product.name}): ${error.message}`);
      failed++;
    } else {
      const imgCount = product.images.length;
      console.log(`  ✓ ${product.id} — ${product.name} [${product.category}] (${imgCount} imgs)`);
      success++;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Imported: ${success}  ✗ Failed: ${failed}`);
  console.log(`\n💡 All prices set to 0 — update via /admin/products\n`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const shouldImport = process.argv.includes('--import');

  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-US'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  const products = [];
  const failed = [];
  console.log(`\n🔍 Scraping ${PRODUCT_IDS.length} products...\n`);

  for (let i = 0; i < PRODUCT_IDS.length; i++) {
    const id = PRODUCT_IDS[i];
    process.stdout.write(`[${String(i + 1).padStart(2)}/${PRODUCT_IDS.length}] `);
    const product = await scrapePage(page, id);

    if (product && product.name) {
      const imgCount = product.images.length;
      console.log(`✓ ${product.name} [${product.category}] (${imgCount} imgs)`);
      products.push(product);
    } else {
      console.log(`⚠ id=${id} — no data, skipping`);
      failed.push(id);
    }

    await new Promise(r => setTimeout(r, 600));
  }

  await browser.close();

  // Save JSON (includes _categoryRaw for debug)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`💾 Saved ${products.length}/${PRODUCT_IDS.length} products → scripts/scraped.json`);
  if (failed.length) console.log(`⚠ Skipped IDs: ${failed.join(', ')}`);

  if (shouldImport) {
    await importToSupabase(products);
  } else {
    console.log('\nReview scripts/scraped.json then run:\n');
    console.log('  node scripts/scrape-duit.js --import\n');
  }
})();
