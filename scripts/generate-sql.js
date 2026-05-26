/**
 * Generate INSERT SQL from scraped.json → run in Supabase SQL Editor
 * Usage: node scripts/generate-sql.js
 * Output: scripts/import_products.sql
 */

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const input = path.join(__dirname, 'scraped.json');
const output = path.join(__dirname, 'import_products.sql');

const products = JSON.parse(fs.readFileSync(input, 'utf-8'));

const escape = (str) => (str || '').replace(/'/g, "''");

const lines = [];

lines.push(`-- DUIT Products Import — ${new Date().toISOString()}`);
lines.push(`-- Run in Supabase SQL Editor`);
lines.push(`-- ${products.length} products from duitoverseas.com`);
lines.push(`-- NOTE: Prices set to 0 — update via /admin/products\n`);

lines.push(`INSERT INTO products (id, name, price, category, tagline, description, features, specs, is_new, is_best, image_url, images, model_url)`);
lines.push(`VALUES`);

const rows = products.map((p, i) => {
  const id = randomUUID();
  const name = escape(p.name);
  const price = p.price || 0;
  const category = escape(p.category);
  const tagline = escape((p.tagline || '').split(/\r?\n/)[0].trim().slice(0, 200));
  const description = escape((p.description || '').slice(0, 1000));
  const features = JSON.stringify(p.features || []).replace(/'/g, "''");
  const specs = JSON.stringify(p.specs || []).replace(/'/g, "''");
  const is_new = p.is_new ? 'true' : 'false';
  const is_best = p.is_best ? 'true' : 'false';
  const image_url = escape(p.image_url || '');
  // Limit to first 10 images to keep SQL manageable
  const images = JSON.stringify((p.images || []).slice(0, 10)).replace(/'/g, "''");
  const comma = i < products.length - 1 ? ',' : ';';

  return `  ('${id}', '${name}', ${price}, '${category}', '${tagline}', '${description}', '${features}'::jsonb, '${specs}'::jsonb, ${is_new}, ${is_best}, '${image_url}', '${images}'::jsonb, '')${comma}`;
});

lines.push(...rows);

lines.push(`\n-- Done. ${products.length} products inserted.`);
lines.push(`-- Now update prices at: /admin/products`);

fs.writeFileSync(output, lines.join('\n'), 'utf-8');
console.log(`✅ Generated: scripts/import_products.sql`);
console.log(`   ${products.length} INSERT statements`);
console.log(`\n📋 Next steps:`);
console.log(`   1. Go to Supabase dashboard → SQL Editor`);
console.log(`   2. Paste contents of scripts/import_products.sql`);
console.log(`   3. Run it`);
console.log(`   4. Update prices at /admin/products\n`);
