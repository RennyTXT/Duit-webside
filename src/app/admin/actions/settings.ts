'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching settings:', error.message);
  }
  return data;
}

export async function updateSettings(formData: any) {
  const supabase = await createClient();
  
  // Attempt to get existing settings ID
  const { data: existing } = await supabase.from('settings').select('id').single();

  let error;
  if (existing) {
    const { error: updateError } = await supabase
      .from('settings')
      .update(formData)
      .eq('id', existing.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('settings')
      .insert([formData]);
    error = insertError;
  }

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout'); // Revalidate everything since settings affect the layout
  return { success: true };
}
