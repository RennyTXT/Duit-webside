'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Map username to a pseudo-email for Supabase Auth compatibility
    const authEmail = `${username.toLowerCase()}@duit.admin`;

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (error) {
      toast.error('Invalid Credentials', {
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FEE2E2',
          borderRadius: '24px',
          fontWeight: 700,
        }
      });
      setIsLoading(false);
    } else {
      toast.success('Access Granted', {
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #DCFCE7',
          borderRadius: '24px',
          fontWeight: 700,
        }
      });
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements - More refined and subtle */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-accent-gold/15 to-transparent rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating Sparkles - Subtle animation */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] text-accent-gold/30 hidden md:block"
      >
        <Sparkles size={32} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] relative z-20"
      >
        {/* Logo/Back to Store - Compact and elegant */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <span className="h-[1px] w-6 bg-primary/10 group-hover:w-10 group-hover:bg-accent-gold transition-all duration-500"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 group-hover:text-primary transition-colors duration-500">
              Return to Atelier
            </span>
            <span className="h-[1px] w-6 bg-primary/10 group-hover:w-10 group-hover:bg-accent-gold transition-all duration-500"></span>
          </Link>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[48px] md:rounded-[64px] p-8 md:p-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white/50 relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent"></div>
          
          <div className="text-center mb-10 relative">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="w-16 h-16 bg-primary text-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-luxury relative z-10 group"
            >
              <div className="absolute inset-0 bg-accent-gold rounded-[24px] scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <ShieldCheck size={28} strokeWidth={1.2} className="relative z-10" />
            </motion.div>
            
            <div className="space-y-2">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[9px] font-black uppercase tracking-[0.5em] text-accent-gold block"
              >
                Access Control
              </motion.span>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-primary leading-tight">
                Private Portal
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              {/* Username Field */}
              <div className="relative">
                <motion.div 
                  animate={{ 
                    backgroundColor: focusedField === 'username' ? 'rgba(255,255,255,1)' : 'rgba(245,245,245,0.5)',
                    borderColor: focusedField === 'username' ? 'rgba(197,165,114,1)' : 'rgba(0,0,0,0.05)'
                  }}
                  className="h-16 border rounded-3xl flex items-center px-6 transition-all duration-300"
                >
                  <User size={16} strokeWidth={1.5} className={`transition-colors duration-300 ${focusedField === 'username' ? 'text-accent-gold' : 'text-neutral-300'}`} />
                  <input 
                    type="text" 
                    value={username}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none pl-4 text-sm font-bold placeholder:text-neutral-300 text-primary"
                    placeholder="Director ID"
                    required
                  />
                </motion.div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <motion.div 
                  animate={{ 
                    backgroundColor: focusedField === 'password' ? 'rgba(255,255,255,1)' : 'rgba(245,245,245,0.5)',
                    borderColor: focusedField === 'password' ? 'rgba(197,165,114,1)' : 'rgba(0,0,0,0.05)'
                  }}
                  className="h-16 border rounded-3xl flex items-center px-6 transition-all duration-300"
                >
                  <Lock size={16} strokeWidth={1.5} className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-accent-gold' : 'text-neutral-300'}`} />
                  <input 
                    type="password" 
                    value={password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none pl-4 text-sm font-bold placeholder:text-neutral-300 text-primary"
                    placeholder="Security Key"
                    required
                  />
                </motion.div>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="group relative w-full bg-primary text-white h-16 md:h-20 rounded-[32px] overflow-hidden transition-all active:scale-[0.98] duration-500 shadow-lg disabled:opacity-50 mt-6"
            >
              <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]"></div>
              <div className="relative z-10 flex items-center justify-center gap-4 h-full w-full pointer-events-none">
                <span className="font-black uppercase tracking-[0.3em] text-[10px] text-white">
                  {isLoading ? 'Verifying...' : 'Authenticate'}
                </span>
                {!isLoading && (
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
                )}
                {isLoading && <Loader2 className="animate-spin text-white" size={16} />}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-neutral-100/50 flex flex-col items-center gap-2">
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/20">Authenticated Secure Session</p>
             <p className="text-[8px] font-bold text-neutral-300 tracking-wider">© 2026 DUIT TH THAILAND</p>
          </div>
        </div>

        {/* Decorative elements - scaled down for better fit */}
        <div className="absolute -top-2 -left-2 w-16 h-16 border-t border-l border-accent-gold/20 rounded-tl-[40px]"></div>
        <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b border-r border-primary/10 rounded-br-[40px]"></div>
      </motion.div>
    </div>
  );
}

