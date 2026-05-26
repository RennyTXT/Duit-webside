import { createClient } from '@/lib/supabase/client';

export async function getSettings() {
  const supabase = createClient();
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
  const supabase = createClient();
  
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
  console.log('Settings updated. Changes will reflect after next build.');
  return { success: true };
}
