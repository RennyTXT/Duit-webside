'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * ล็อกอินเข้าสู่ระบบ Admin โดยใช้ Username
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
  }

  // แปลง username เป็นรูปแบบ email ที่เรากำหนดไว้ใน Supabase
  // เช่น admin -> admin@duit.admin
  const email = username.includes('@') ? username : `${username}@duit.admin`;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }

  redirect('/admin');
}

/**
 * ออกจากระบบ
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
