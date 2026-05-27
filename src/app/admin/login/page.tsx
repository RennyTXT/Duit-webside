'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Mail, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // เช็คว่าถ้า login อยู่แล้วให้ไปหน้า admin เลย
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin');
      }
    };
    checkUser();
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // แปลง username เป็นรูปแบบ email ที่เรากำหนดไว้ใน Supabase
      const email = username.includes('@') ? username : `${username}@duit.admin`;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
        return;
      }

      toast.success('ยินดีต้อนรับเข้าสู่ระบบ');
      router.push('/admin');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6] p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white rounded-[48px] shadow-luxury border border-neutral-100 p-10 md:p-16 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-accent-gold/40"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Secure Access</span>
              <div className="h-[1px] w-8 bg-accent-gold/40"></div>
            </div>
            <h1 className="text-4xl font-black tracking-[-0.04em] uppercase text-primary leading-none">
              Atelier <br />
              <span className="text-luxury-gradient">Concierge</span>
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pt-2">
              Management Portal for Duit Thailand
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-accent-gold transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input 
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full h-16 bg-neutral-50 border border-neutral-100 rounded-2xl pl-16 pr-6 text-sm font-bold focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none placeholder:text-neutral-300 uppercase tracking-tight"
                />
              </div>

              {/* Password Field */}
              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-accent-gold transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input 
                  type="password"
                  placeholder="Security Access Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-16 bg-neutral-50 border border-neutral-100 rounded-2xl pl-16 pr-6 text-sm font-bold focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none placeholder:text-neutral-300 uppercase tracking-tight"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-16 bg-primary text-white rounded-2xl overflow-hidden transition-all shadow-luxury flex items-center justify-center gap-4 active:scale-95 duration-500 disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              {isLoading ? (
                <Loader2 size={20} className="animate-spin relative z-10 text-white" />
              ) : (
                <>
                  <span className="relative z-10 font-black uppercase tracking-[0.2em] text-[10px]">Verify Identity</span>
                  <ChevronRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="pt-4 text-center">
            <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-[0.2em] leading-relaxed">
              Authorized Personnel Only. <br />
              Encryption active and monitored.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
