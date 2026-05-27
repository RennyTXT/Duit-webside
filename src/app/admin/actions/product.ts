'use server';

import { createClient } from '@/lib/supabase/server';

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw new Error(error.message);
  console.log('Product deleted. Changes will reflect after next build.');
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const category = formData.get('category') as string;
  const tagline = formData.get('tagline') as string;
  const description = formData.get('description') as string;
  const is_new = formData.get('is_new') === 'true';
  const is_best = formData.get('is_best') === 'true';
  const imageUrl = formData.get('image_url') as string;
  const images = JSON.parse((formData.get('images') as string) || '[]');
  const modelUrl = formData.get('model_url') as string;

  // Process JSON fields
  const features = JSON.parse((formData.get('features') as string) || '[]');
  const specs = JSON.parse((formData.get('specs') as string) || '[]');

  const productData = {
    name,
    price,
    category,
    tagline,
    description,
    features,
    specs,
    is_new,
    is_best,
    image_url: imageUrl,
    images: images,
    model_url: modelUrl,
  };

  let error;
  if (id) {
    const { error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('products')
      .insert([productData]);
    error = insertError;
  }

  if (error) throw new Error(error.message);
  console.log('Product upserted. Changes will reflect after next build.');
}
