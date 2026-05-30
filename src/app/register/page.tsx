'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Home, 
  Phone, 
  Smartphone, 
  Gift, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  PawPrint, 
  Maximize2 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

export default function RegisterWizard() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    // Step 1: User Info
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    postalCode: '',
    basicAddress: '',
    detailAddress: '',
    homePhonePrefix: '02',
    homePhonePart1: '',
    homePhonePart2: '',
    mobilePhonePrefix: '010',
    mobilePhonePart1: '',
    mobilePhonePart2: '',

    // Step 2: Pet Info
    petBirthYear: '',
    petBirthMonth: '',
    petBirthDay: '',
    petNickname: '',
    petType: '' as 'dog' | 'cat' | '',
    petSize: '' as 'small' | 'medium' | 'large' | '',
    referralCode: '',
  });

  // --- VALIDATION LOGIC ---
  const validateStep1 = () => {
    const { username, email, password, confirmPassword, fullname, mobilePhonePart1, mobilePhonePart2 } = formData;

    // Username: 4-16 alphanumeric
    if (!/^[a-z0-9]{4,16}$/.test(username)) {
      toast.error(t.auth.usernameHint);
      return false;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(language === 'th' ? 'กรุณากรอกอีเมลให้ถูกต้อง' : 'Invalid email address');
      return false;
    }

    // Password: 10-16 chars, mix of types
    // Screenshot: "การผสมผสานอย่างน้อย 2 อย่างของตัวอักษรภาษาอังกฤษพิมพ์ใหญ่/พิมพ์เล็ก ตัวเลข และอักขระพิเศษ ความยาว 10 ถึง 16 ตัวอักษร"
    const typesCount = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ].filter(Boolean).length;

    if (password.length < 10 || password.length > 16 || typesCount < 2) {
      toast.error(t.auth.passwordHint);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error(language === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
      return false;
    }

    if (!fullname) {
      toast.error(language === 'th' ? 'กรุณากรอกชื่อ' : 'Full name is required');
      return false;
    }

    if (!mobilePhonePart1 || !mobilePhonePart2) {
      toast.error(language === 'th' ? 'กรุณากรอกเบอร์มือถือ' : 'Mobile phone is required');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleRegister = async () => {
    if (!formData.petNickname || !formData.petType || !formData.petSize) {
      toast.error(language === 'th' ? 'กรุณากรอกข้อมูลสัตว์เลี้ยงให้ครบถ้วน' : 'Please fill in pet information');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    try {
      // 1. Create User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname,
            username: formData.username,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Auth failed');

      // 2. Update Profile with detailed info
      const fullHomePhone = formData.homePhonePart1 ? `${formData.homePhonePrefix}-${formData.homePhonePart1}-${formData.homePhonePart2}` : '';
      const fullMobilePhone = `${formData.mobilePhonePrefix}-${formData.mobilePhonePart1}-${formData.mobilePhonePart2}`;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          username: formData.username,
          full_name: formData.fullname,
          email: formData.email,
          address_postal: formData.postalCode,
          address_basic: formData.basicAddress,
          address_detail: formData.detailAddress,
          home_phone: fullHomePhone,
          mobile_phone: fullMobilePhone,
          referral_code: formData.referralCode,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // 3. Insert Pet Info
      const birthDate = formData.petBirthYear ? `${formData.petBirthYear}-${formData.petBirthMonth.padStart(2, '0')}-${formData.petBirthDay.padStart(2, '0')}` : null;

      const { error: petError } = await supabase
        .from('pets')
        .insert({
          owner_id: authData.user.id,
          name: formData.petNickname,
          nickname: formData.petNickname,
          type: formData.petType,
          size: formData.petSize,
          birth_date: birthDate,
        });

      if (petError) throw petError;

      toast.success(language === 'th' ? 'ลงทะเบียนสำเร็จ!' : 'Registration successful!');
      router.push('/pet-profile');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 pb-20 relative overflow-hidden">
      {/* Background grain & pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440" fill className="object-cover" alt="" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12 sm:mb-20">
          <div className={`flex items-center gap-3 transition-all ${step === 1 ? 'text-primary' : 'text-neutral-300'}`}>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'border-primary bg-primary text-white' : 'border-neutral-200'}`}>
                {step > 1 ? <CheckCircle2 size={20} /> : '01'}
             </div>
             <span className="text-[10px] uppercase tracking-[0.3em] font-medium hidden sm:block">{t.auth.step1}</span>
          </div>
          <div className="w-12 h-px bg-neutral-100"></div>
          <div className={`flex items-center gap-3 transition-all ${step === 2 ? 'text-primary' : 'text-neutral-300'}`}>
             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-primary bg-primary text-white' : 'border-neutral-200'}`}>
                02
             </div>
             <span className="text-[10px] uppercase tracking-[0.3em] font-medium hidden sm:block">{t.auth.step2}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12 sm:space-y-16"
            >
              <div className="text-center space-y-4">
                 <h1 className="text-4xl sm:text-5xl uppercase tracking-tighter">{t.auth.step1}</h1>
                 <p className="text-sm text-secondary opacity-60 max-w-md mx-auto">{language === 'th' ? 'สร้างบัญชีเพื่อรับสิทธิพิเศษมากมายจาก Duit Atelier' : 'Create an account to unlock exclusive privileges'}</p>
              </div>

              <div className="bg-neutral-50 rounded-[40px] p-8 sm:p-12 space-y-10 border border-neutral-100 shadow-sm">
                {/* Username */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center gap-2">
                    {t.auth.username} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3 space-y-2">
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={e => updateField('username', e.target.value)}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                    <p className="text-[10px] text-neutral-400 italic">{t.auth.usernameHint}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-neutral-100 pt-10">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                    {t.auth.email} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3 space-y-2">
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                    <p className="text-[10px] text-neutral-400 italic">{t.auth.emailHint}</p>
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-t border-neutral-100 pt-10">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-4">
                    {t.auth.password} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3 space-y-4">
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={e => updateField('password', e.target.value)}
                      placeholder={t.auth.password}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={e => updateField('confirmPassword', e.target.value)}
                      placeholder={t.auth.confirmPassword}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                    <p className="text-[10px] text-neutral-400 italic">{t.auth.passwordHint}</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-neutral-100 pt-10">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                    {t.auth.name} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3">
                    <input 
                      type="text" 
                      value={formData.fullname}
                      onChange={e => updateField('fullname', e.target.value)}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Address Block */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-t border-neutral-100 pt-10">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-4">
                    {t.auth.address}
                  </label>
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex gap-4">
                       <input 
                        type="text" 
                        value={formData.postalCode}
                        onChange={e => updateField('postalCode', e.target.value)}
                        placeholder={t.auth.postalCode}
                        className="w-40 h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                      />
                      <button className="px-8 bg-neutral-200 text-secondary rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-300 transition-colors">
                        {t.auth.findAddress}
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formData.basicAddress}
                      onChange={e => updateField('basicAddress', e.target.value)}
                      placeholder={t.auth.basicAddress}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                    <input 
                      type="text" 
                      value={formData.detailAddress}
                      onChange={e => updateField('detailAddress', e.target.value)}
                      placeholder={t.auth.detailAddress}
                      className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Phones */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start border-t border-neutral-100 pt-10">
                  {/* Home Phone */}
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-4">{t.auth.homePhone}</label>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-4">
                     <select 
                      value={formData.homePhonePrefix}
                      onChange={e => updateField('homePhonePrefix', e.target.value)}
                      className="h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-sm outline-none"
                     >
                       <option>02</option>
                       <option>03</option>
                       <option>04</option>
                       <option>05</option>
                       <option>07</option>
                     </select>
                     <span className="text-neutral-300">-</span>
                     <input 
                      type="text" 
                      maxLength={4}
                      value={formData.homePhonePart1}
                      onChange={e => updateField('homePhonePart1', e.target.value)}
                      className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                     />
                     <span className="text-neutral-300">-</span>
                     <input 
                      type="text" 
                      maxLength={4}
                      value={formData.homePhonePart2}
                      onChange={e => updateField('homePhonePart2', e.target.value)}
                      className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                     />
                  </div>

                  {/* Mobile Phone */}
                  <div className="flex flex-col gap-4 border-t border-neutral-100 pt-6 md:border-0 md:pt-0">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-4">
                      {t.auth.mobilePhone} <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-4 pt-0 md:pt-4">
                     <select 
                      value={formData.mobilePhonePrefix}
                      onChange={e => updateField('mobilePhonePrefix', e.target.value)}
                      className="h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-sm outline-none"
                     >
                       <option>010</option>
                       <option>011</option>
                       <option>06</option>
                       <option>08</option>
                       <option>09</option>
                     </select>
                     <span className="text-neutral-300">-</span>
                     <input 
                      type="text" 
                      maxLength={4}
                      value={formData.mobilePhonePart1}
                      onChange={e => updateField('mobilePhonePart1', e.target.value)}
                      className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                     />
                     <span className="text-neutral-300">-</span>
                     <input 
                      type="text" 
                      maxLength={4}
                      value={formData.mobilePhonePart2}
                      onChange={e => updateField('mobilePhonePart2', e.target.value)}
                      className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                     />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleNext}
                  className="w-full sm:w-80 h-20 bg-primary text-white rounded-full flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-xs hover:bg-accent-gold transition-all shadow-xl active:scale-95 group"
                >
                  {t.crm.proceed} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 sm:space-y-16"
            >
              <div className="text-center space-y-4">
                 <div className="inline-flex items-center gap-3 px-6 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-[10px] uppercase tracking-widest font-bold">
                    <Gift size={14} /> Birthday Coupon Event
                 </div>
                 <h1 className="text-4xl sm:text-5xl uppercase tracking-tighter leading-tight">{t.auth.petRegistrationTitle}</h1>
                 <p className="text-sm text-secondary opacity-60 max-w-md mx-auto">{t.auth.birthdayHint}</p>
              </div>

              <div className="bg-neutral-50 rounded-[40px] p-8 sm:p-12 space-y-12 border border-neutral-100 shadow-sm">
                 {/* Pet Birthday */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                      {t.auth.petBirthday} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3 flex items-center gap-4">
                       <input 
                        type="text" 
                        placeholder={t.auth.year}
                        value={formData.petBirthYear}
                        onChange={e => updateField('petBirthYear', e.target.value)}
                        className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                       />
                       <span className="text-neutral-300">/</span>
                       <input 
                        type="text" 
                        placeholder={t.auth.month}
                        value={formData.petBirthMonth}
                        onChange={e => updateField('petBirthMonth', e.target.value)}
                        className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                       />
                       <span className="text-neutral-300">/</span>
                       <input 
                        type="text" 
                        placeholder={t.auth.day}
                        value={formData.petBirthDay}
                        onChange={e => updateField('petBirthDay', e.target.value)}
                        className="flex-1 h-14 bg-white border border-neutral-100 rounded-2xl px-4 text-center text-sm outline-none"
                       />
                    </div>
                 </div>

                 {/* Pet Nickname */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                      {t.auth.petNickname} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3">
                      <input 
                        type="text" 
                        value={formData.petNickname}
                        onChange={e => updateField('petNickname', e.target.value)}
                        className="w-full h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none"
                      />
                    </div>
                 </div>

                 {/* Pet Type */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                      {t.auth.petType} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3 flex gap-8">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petType" 
                            className="w-5 h-5 accent-primary" 
                            onChange={() => updateField('petType', 'cat')}
                          />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{language === 'th' ? 'แมว' : 'Cat'}</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petType" 
                            className="w-5 h-5 accent-primary" 
                            onChange={() => updateField('petType', 'dog')}
                          />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{language === 'th' ? 'ลูกสุนัข' : 'Puppy'}</span>
                       </label>
                    </div>
                 </div>

                 {/* Pet Size */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                      {t.auth.petSize} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3 flex flex-wrap gap-8">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petSize" 
                            className="w-5 h-5 accent-primary" 
                            onChange={() => updateField('petSize', 'small')}
                          />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{language === 'th' ? 'เล็ก' : 'Small'}</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petSize" 
                            className="w-5 h-5 accent-primary" 
                            onChange={() => updateField('petSize', 'medium')}
                          />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{language === 'th' ? 'ขนาดกลาง' : 'Medium'}</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petSize" 
                            className="w-5 h-5 accent-primary" 
                            onChange={() => updateField('petSize', 'large')}
                          />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{language === 'th' ? 'ขนาดใหญ่' : 'Large'}</span>
                       </label>
                    </div>
                 </div>

                 {/* Referral Code */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                      {t.auth.referralCode}
                    </label>
                    <div className="md:col-span-3">
                      <input 
                        type="text" 
                        value={formData.referralCode}
                        onChange={e => updateField('referralCode', e.target.value)}
                        className="w-full sm:w-60 h-14 bg-white border border-neutral-100 rounded-2xl px-6 text-sm outline-none"
                      />
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={() => setStep(1)}
                  className="w-full sm:w-48 h-20 border border-neutral-100 text-secondary rounded-full flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[10px] hover:bg-neutral-50 transition-all"
                >
                  <ArrowLeft size={16} /> {t.crm.back}
                </button>
                <button 
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full sm:w-80 h-20 bg-primary text-white rounded-full flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-xs hover:bg-accent-gold transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {language === 'th' ? 'ลงทะเบียน' : 'Register'} <ShieldCheck size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
