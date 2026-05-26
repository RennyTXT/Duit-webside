/**
 * Import scraped.json → Supabase
 * Usage: node scripts/import-only.js
 */

const { randomUUID } = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://tupvzkekyzgxhwagrvgl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rVdoP5SZzmIgTCCiKwWepg_T9qB3rLR';

async function main() {
  const file = path.join(__dirname, 'scraped.json');
  if (!fs.existsSync(file)) {
    console.error('scraped.json not found. Run scrape-duit.js first.');
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Check existing names to avoid duplicates
  const { data: existing } = await supabase.from('products').select('name');
  const existingNames = new Set((existing || []).map(p => p.name.toLowerCase().trim()));

  console.log(`\n📦 Importing ${products.length} products to Supabase...`);
  console.log(`ℹ  ${existingNames.size} products already exist (will skip duplicates)\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const nameLower = product.name.toLowerCase().trim();

    // Skip if name already exists
    if (existingNames.has(nameLower)) {
      console.log(`  ⏭  ${product.name} — already exists`);
      skipped++;
      continue;
    }

    const payload = {
      id: randomUUID(),
      name: product.name,
      price: product.price || 0,
      category: product.category,
      tagline: product.tagline || '',
      description: product.description || '',
      features: product.features || [],
      specs: product.specs || [],
      is_new: product.is_new || false,
      is_best: product.is_best || false,
      image_url: product.image_url || '',
      images: product.images || [],
      model_url: '',
    };

    const { error } = await supabase.from('products').insert([payload]);

    if (error) {
      console.error(`  ✗ ${product.name}: ${error.message}`);
      failed++;
    } else {
      const imgCount = product.images.length;
      console.log(`  ✓ ${product.name} [${product.category}] (${imgCount} imgs)`);
      success++;
      existingNames.add(nameLower); // prevent duplicate within same run
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`✅ Imported: ${success}`);
  console.log(`⏭  Skipped:  ${skipped} (duplicates)`);
  console.log(`✗  Failed:   ${failed}`);
  console.log('\n💡 Prices set to 0 — update via /admin/products\n');
}

main().catch(console.error);
