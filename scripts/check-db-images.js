const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImages() {
  console.log('Fetching products from Supabase...');
  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url, images');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No products found in the database.');
    return;
  }

  console.log(`Found ${data.length} products:\n`);
  data.forEach(product => {
    console.log(`--- Product: ${product.name} (ID: ${product.id}) ---`);
    console.log(`Main Image: ${product.image_url}`);
    if (product.images && product.images.length > 0) {
      console.log(`Gallery Images:`);
      product.images.forEach((url, i) => console.log(`  ${i + 1}: ${url}`));
    } else {
      console.log('Gallery Images: None');
    }
    console.log('');
  });
}

checkImages();
