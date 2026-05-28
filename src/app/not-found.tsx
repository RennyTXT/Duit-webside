'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // 💡 GitHub Pages 404 Hack
    // หากเข้าหน้าสินค้าที่ยังไม่ได้ Build (เช่นสินค้าใหม่จาก Supabase)
    // เราจะพยายามอ่าน Path แล้วพาไปหน้าสินค้าด้วยวิธี Client-side
    const path = window.location.pathname;
    const productMatch = path.match(/\/products\/([^\/]+)/);
    
    if (productMatch && productMatch[1]) {
      const productId = productMatch[1];
      // เก็บค่า ID ไว้ใน Session หรือเปลี่ยนวิธีนำทาง
      // แต่ GitHub Pages จะวนลูป 404 หาก Path ไม่มีไฟล์จริง
      // ดังนั้นทางแก้ที่ดีที่สุดสำหรับ GitHub Pages คือการกด Build ใหม่
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h1 className="text-[120px] text-neutral-100 leading-none">404</h1>
      <div className="space-y-4 -mt-8">
        <h2 className="text-2xl uppercase tracking-widest text-primary">Masterpiece Not Found</h2>
        <p className="text-neutral-400 max-w-md mx-auto text-sm">
          The item you are looking for might be part of a new collection. 
          Please try again later or return to our gallery.
        </p>
      </div>
      <button 
        onClick={() => window.location.href = '/Duit-webside/'}
        className="mt-12 px-12 py-4 bg-primary text-white rounded-full uppercase tracking-widest text-[10px] hover:bg-accent-gold transition-colors"
      >
        Return to Gallery
      </button>
    </div>
  );
}
