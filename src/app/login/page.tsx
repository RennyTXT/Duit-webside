'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, RefreshCw, Loader2, X, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';
import Image from 'next/image';
import Link from 'next/link';

export default function EmailLoginPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<'email' | 'otp' | 'name'>('email');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(language === 'th' ? 'กรุณากรอกอีเมลให้ถูกต้อง' : 'Please enter a valid email address');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) throw error;

      setStep('otp');
      setTimer(60);
      toast.success(language === 'th' ? 'ส่งรหัส OTP ไปที่อีเมลแล้ว' : 'OTP sent to your email');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value)) && value !== "") return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) return;

    setIsVerifying(true);
    try {
      // 1. ยืนยันรหัส OTP กับ Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'email',
      });

      if (error) throw error;

      // 2. ดึงข้อมูลโปรไฟล์แบบรวดเร็ว (ใช้ maybeSingle แทน single เพื่อลด Error)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user?.id)
        .maybeSingle();

      // 3. ถ้ามีชื่ออยู่แล้ว ให้ไปหน้า Profile เลยทันที
      if (profile?.full_name) {
        toast.success(language === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Logged in successfully');
        // ใช้ window.location เพื่อล้างแคชและไปหน้าถัดไปแบบรวดเร็ว
        window.location.href = '/pet-profile';
      } else {
        // ถ้าเป็นคนใหม่ ให้ไปหน้ากรอกชื่อ
        setStep('name');
        setIsVerifying(false);
      }
    } catch (error: any) {
      toast.error(language === 'th' ? 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ' : 'Invalid or expired OTP');
      setIsVerifying(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Session expired');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullname,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(language === 'th' ? 'สร้างบัญชีสำเร็จ' : 'Account created successfully');
      router.push('/pet-profile');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440" fill className="object-cover" alt="" />
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-block hover:scale-105 transition-transform duration-500">
            <span className="font-greycliff text-5xl lowercase tracking-tight text-primary">duit</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl uppercase tracking-tighter">
              {step === 'email' && (language === 'th' ? 'เข้าสู่ระบบ / สมัครสมาชิก' : 'Sign In / Register')}
              {step === 'otp' && (language === 'th' ? 'ยืนยันรหัส OTP' : 'Verify OTP')}
              {step === 'name' && (language === 'th' ? 'ยินดีต้อนรับสู่ Duit' : 'Welcome to Duit')}
            </h1>
            <p className="text-sm text-secondary font-medium opacity-60">
              {step === 'email' && (language === 'th' ? 'ใช้อีเมลเพื่อสะสมคะแนนจากทุกช่องทาง' : 'Use your email to sync rewards across all channels')}
              {step === 'otp' && (language === 'th' ? `เราได้ส่งรหัส 6 หลักไปที่ ${email}` : `We sent a 6-digit code to ${email}`)}
              {step === 'name' && (language === 'th' ? 'กรุณากรอกชื่อของคุณเพื่อเริ่มต้นประสบการณ์' : 'Please enter your name to start the experience')}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form 
              key="email-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSendOTP}
              className="space-y-8"
            >
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-20 bg-neutral-50 border border-neutral-100 rounded-3xl px-16 text-lg tracking-tight outline-none focus:bg-white focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              <button 
                disabled={isSending || !email.includes('@')}
                className="w-full h-20 bg-primary text-white rounded-3xl flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-primary transition-all shadow-xl active:scale-95"
              >
                {isSending ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    {language === 'th' ? 'รับรหัส OTP' : 'Send OTP'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.div 
              key="otp-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="flex justify-between gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-full aspect-square bg-neutral-50 border border-neutral-100 rounded-2xl text-center text-2xl font-medium outline-none focus:bg-white focus:border-primary transition-all shadow-sm"
                    maxLength={1}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleVerifyOTP}
                  disabled={isVerifying || otp.join('').length < 6}
                  className="w-full h-20 bg-primary text-white rounded-3xl flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-primary transition-all shadow-xl active:scale-95"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {language === 'th' ? 'ยืนยันรหัส' : 'Verify Code'}
                      <ShieldCheck size={18} strokeWidth={1.5} />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-4 pt-4">
                  <button 
                    onClick={() => setStep('email')}
                    className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                  >
                    {language === 'th' ? 'เปลี่ยนอีเมล' : 'Change Email'}
                  </button>
                  
                  {timer > 0 ? (
                    <p className="text-[10px] uppercase tracking-widest text-neutral-300">
                      Resend in {timer}s
                    </p>
                  ) : (
                    <button 
                      onClick={handleSendOTP}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-gold hover:opacity-70 transition-all"
                    >
                      <RefreshCw size={12} />
                      {language === 'th' ? 'ส่งรหัสอีกครั้ง' : 'Resend Code'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'name' && (
            <motion.form 
              key="name-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSaveProfile}
              className="space-y-8"
            >
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </div>
                <input 
                  type="text" 
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Full Name"
                  className="w-full h-20 bg-neutral-50 border border-neutral-100 rounded-3xl px-16 text-lg tracking-tight outline-none focus:bg-white focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              <button 
                disabled={isSaving || !fullname}
                className="w-full h-20 bg-primary text-white rounded-3xl flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-primary transition-all shadow-xl active:scale-95"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    {language === 'th' ? 'เริ่มต้นใช้งาน' : 'Get Started'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-[9px] uppercase tracking-[0.2em] text-neutral-300 pt-12">
          By continuing, you agree to Duit's <br />
          <Link href="/terms" className="text-secondary hover:text-primary underline">Terms of Service</Link> and <Link href="/privacy" className="text-secondary hover:text-primary underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
