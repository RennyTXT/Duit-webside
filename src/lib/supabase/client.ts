import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ป้องกัน Error ในช่วง Build (Prerendering) บน Vercel 
  // หากไม่มีค่า URL/Key และทำงานบน Server ให้ส่งค่าว่างไปก่อนแทนการ Throw Error
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      return createBrowserClient(
        supabaseUrl || 'https://placeholder.supabase.co', 
        supabaseAnonKey || 'placeholder'
      );
    }
    throw new Error('Supabase URL and Anon Key are required');
  }

  // ล้างค่า URL เพื่อป้องกันการตั้งค่าผิด (เช่น มี /rest/v1 หรือ / ต่อท้าย)
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  
  // Debug เพื่อดูค่า URL ที่แท้จริง (ลบออกได้หลังจากแก้ปัญหาได้แล้ว)
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase Client Initialized with:', supabaseUrl);
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
