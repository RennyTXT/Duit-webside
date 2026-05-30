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
  const [isFindingAddress, setIsFindingAddress] = useState(false);

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
    subdistrict: '',
    district: '',
    province: '',
    detailAddress: '',
    homePhone: '',
    mobilePhone: '',

    // Step 2: Pet Info
    petBirthYear: '',
    petBirthMonth: '',
    petBirthDay: '',
    petNickname: '',
    petType: '' as 'dog' | 'cat' | '',
    petSize: '' as 'small' | 'medium' | 'large' | '',
    petImageUrl: '',
    referralCode: '',
  });

  // --- VALIDATION LOGIC ---
  const validateStep1 = () => {
    const { username, email, password, confirmPassword, fullname, mobilePhone } = formData;

    // Username: Mandatory, no character constraints
    if (!username.trim()) {
      toast.error(t.auth.usernameHint);
      return false;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(language === 'th' ? 'กรุณากรอกอีเมลให้ถูกต้อง' : 'Invalid email address');
      return false;
    }

    // Password: Min 8 chars
    if (password.length < 8) {
      toast.error(language === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' : 'Password must be at least 8 characters');
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

    if (!mobilePhone) {
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

  // --- DROPDOWN HELPERS ---
  const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);
  const monthsTh = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysArr = Array.from({ length: 31 }, (_, i) => i + 1);

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

      if (authError) {
        if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already exists')) {
          toast.error(language === 'th' ? 'อีเมลนี้ถูกลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบ' : 'User already registered. Please sign in.');
          setIsLoading(false);
          return;
        }
        throw authError;
      }
      
      if (!authData.user) throw new Error('Auth failed');

      // 2. Update Profile with detailed info
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          username: formData.username,
          full_name: formData.fullname,
          email: formData.email,
          address_postal: formData.postalCode,
          address_basic: formData.basicAddress,
          subdistrict: formData.subdistrict,
          district: formData.district,
          province: formData.province,
          address_detail: formData.detailAddress,
          home_phone: formData.homePhone,
          mobile_phone: formData.mobilePhone,
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
          image_url: formData.petImageUrl,
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

  const handleFindAddress = async () => {
    const zipInput = formData.postalCode?.trim();
    if (!zipInput || zipInput.length !== 5) {
      toast.error(language === 'th' ? 'กรุณากรอกรหัสไปรษณีย์ 5 หลัก' : 'Please enter a 5-digit postal code');
      return;
    }

    setIsFindingAddress(true);
    const loadingToast = toast.loading(language === 'th' ? 'กำลังดึงข้อมูลที่อยู่...' : 'Fetching address data...');
    
    try {
      // Use the consolidated geography dataset for efficiency (one request instead of three)
      const response = await fetch('https://cdn.jsdelivr.net/gh/thailand-geography-data/thailand-geography-json@main/src/geography.json');
      
      if (!response.ok) throw new Error('Failed to fetch dataset');
      
      const data = await response.json();
      
      // Find matching entry
      const zipNum = Number(zipInput);
      const match = data.find((item: any) => 
        String(item.postalCode) === zipInput || item.postalCode === zipNum
      );

      if (match) {
        setFormData(prev => ({
          ...prev,
          subdistrict: match.subdistrictNameTh || '',
          district: match.districtNameTh || '',
          province: match.provinceNameTh || '',
        }));
        
        toast.dismiss(loadingToast);
        toast.success(language === 'th' ? 'ดึงข้อมูลที่อยู่เรียบร้อย' : 'Address filled');
      } else {
        toast.dismiss(loadingToast);
        toast.error(language === 'th' ? 'ไม่พบข้อมูลสำหรับรหัสไปรษณีย์นี้' : 'No data found for this postal code');
      }
    } catch (error) {
      console.error('Address lookup failed:', error);
      toast.dismiss(loadingToast);
      toast.error(language === 'th' ? 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณากรอกเอง' : 'Connection failed, please type manually');
    } finally {
      setIsFindingAddress(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'th' ? 'รูปภาพต้องมีขนาดไม่เกิน 5MB' : 'Image must be under 5MB');
      return;
    }

    const loadingToast = toast.loading(language === 'th' ? 'กำลังอัปโหลดรูปภาพ...' : 'Uploading image...');
    try {
      const supabase = createClient();
      
      // Temporary ID for anonymous/registering users
      const fileName = `temp-${Math.random()}.${file.name.split('.').pop()}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);

      updateField('petImageUrl', publicUrl);
      toast.dismiss(loadingToast);
      toast.success(language === 'th' ? 'อัปโหลดรูปภาพสำเร็จ' : 'Image uploaded successfully');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
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
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold flex items-center gap-2">
                    {language === 'th' ? 'ชื่อผู้ใช้' : 'Username'} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3 space-y-2">
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={e => updateField('username', e.target.value)}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                    <p className="text-xs text-neutral-600 font-medium italic">{t.auth.usernameHint}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-neutral-100 pt-10">
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                    {t.auth.email} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3 space-y-2">
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                    <p className="text-xs text-neutral-600 font-medium italic">{t.auth.emailHint}</p>
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-t border-neutral-100 pt-10">
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold mt-4">
                    {t.auth.password} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3 space-y-4">
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={e => updateField('password', e.target.value)}
                      placeholder={t.auth.password}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={e => updateField('confirmPassword', e.target.value)}
                      placeholder={t.auth.confirmPassword}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                    <p className="text-xs text-neutral-600 font-medium italic">{t.auth.passwordHint}</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-t border-neutral-100 pt-10">
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                    {t.auth.name} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3">
                    <input 
                      type="text" 
                      value={formData.fullname}
                      onChange={e => updateField('fullname', e.target.value)}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Address Block */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-t border-neutral-100 pt-10">
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold mt-4">
                    {t.auth.address}
                  </label>
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex gap-4">
                       <input 
                        type="text" 
                        value={formData.postalCode}
                        onChange={e => updateField('postalCode', e.target.value)}
                        placeholder={t.auth.postalCode}
                        className="w-48 h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                      />
                      <button 
                        onClick={handleFindAddress}
                        disabled={isFindingAddress}
                        className="px-10 bg-neutral-200 text-neutral-900 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:bg-neutral-300 transition-colors flex items-center justify-center min-w-[140px]"
                      >
                        {isFindingAddress ? <Loader2 size={16} className="animate-spin" /> : t.auth.findAddress}
                      </button>
                    </div>
                    
                    <input 
                      type="text" 
                      value={formData.basicAddress}
                      onChange={e => updateField('basicAddress', e.target.value)}
                      placeholder={t.auth.basicAddress}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <input 
                        type="text" 
                        value={formData.subdistrict}
                        onChange={e => updateField('subdistrict', e.target.value)}
                        placeholder={t.auth.subdistrict}
                        className="h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                      />
                      <input 
                        type="text" 
                        value={formData.district}
                        onChange={e => updateField('district', e.target.value)}
                        placeholder={t.auth.district}
                        className="h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                      />
                      <input 
                        type="text" 
                        value={formData.province}
                        onChange={e => updateField('province', e.target.value)}
                        placeholder={t.auth.province}
                        className="h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                      />
                    </div>

                    <input 
                      type="text" 
                      value={formData.detailAddress}
                      onChange={e => updateField('detailAddress', e.target.value)}
                      placeholder={t.auth.detailAddress}
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Phones */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start border-t border-neutral-100 pt-10">
                  {/* Home Phone */}
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold mt-4">{t.auth.homePhone}</label>
                  <div className="md:col-span-3">
                    <input 
                      type="text" 
                      value={formData.homePhone}
                      onChange={e => updateField('homePhone', e.target.value)}
                      placeholder="02-XXX-XXXX"
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>

                  {/* Mobile Phone */}
                  <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold mt-4">
                    {t.auth.mobilePhone} <span className="text-red-500">*</span>
                  </label>
                  <div className="md:col-span-3">
                    <input 
                      type="text" 
                      value={formData.mobilePhone}
                      onChange={e => updateField('mobilePhone', e.target.value)}
                      placeholder="0XX-XXX-XXXX"
                      className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none focus:border-primary transition-all shadow-sm font-bold"
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
                 <div className="inline-flex items-center gap-3 px-6 py-2 bg-accent-gold/10 text-accent-gold rounded-full text-[11px] uppercase tracking-widest font-bold">
                    <Gift size={16} /> Birthday Coupon Event
                 </div>
                 <h1 className="text-4xl sm:text-5xl uppercase tracking-tighter leading-tight text-neutral-900">{t.auth.petRegistrationTitle}</h1>
                 <p className="text-base text-neutral-600 font-medium max-w-md mx-auto">{t.auth.birthdayHint}</p>
              </div>

              <div className="bg-neutral-50 rounded-[40px] p-8 sm:p-12 space-y-12 border border-neutral-100 shadow-sm">
                 {/* Pet Birthday */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                      {t.auth.petBirthday} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3 grid grid-cols-3 gap-2 sm:gap-4 items-center w-full">
                       <select 
                        value={formData.petBirthYear}
                        onChange={e => updateField('petBirthYear', e.target.value)}
                        className="w-full min-w-0 h-16 bg-white border border-neutral-200 rounded-2xl px-1 sm:px-4 text-center text-sm sm:text-lg text-primary outline-none shadow-sm appearance-none cursor-pointer hover:border-primary transition-colors"
                       >
                         <option value="">{t.auth.year}</option>
                         {years.map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                       <select 
                        value={formData.petBirthMonth}
                        onChange={e => updateField('petBirthMonth', e.target.value)}
                        className="w-full min-w-0 h-16 bg-white border border-neutral-200 rounded-2xl px-1 sm:px-4 text-center text-sm sm:text-lg text-primary outline-none shadow-sm appearance-none cursor-pointer hover:border-primary transition-colors"
                       >
                         <option value="">{t.auth.month}</option>
                         {(language === 'th' ? monthsTh : monthsEn).map((m, i) => (
                           <option key={m} value={i + 1}>{m}</option>
                         ))}
                       </select>
                       <select 
                        value={formData.petBirthDay}
                        onChange={e => updateField('petBirthDay', e.target.value)}
                        className="w-full min-w-0 h-16 bg-white border border-neutral-200 rounded-2xl px-1 sm:px-4 text-center text-sm sm:text-lg text-primary outline-none shadow-sm appearance-none cursor-pointer hover:border-primary transition-colors"
                       >
                         <option value="">{t.auth.day}</option>
                         {daysArr.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                 </div>

                 {/* Pet Photo */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                      {language === 'th' ? 'รูปภาพของน้อง' : 'Pet Photo'}
                    </label>
                    <div className="md:col-span-3">
                       <div className="flex flex-col items-center sm:items-start gap-6">
                          <div className="relative w-40 h-40 rounded-[32px] overflow-hidden border-2 border-dashed border-neutral-200 bg-white flex items-center justify-center group hover:border-primary transition-colors">
                            {formData.petImageUrl ? (
                              <>
                                <Image src={formData.petImageUrl} alt="Pet Preview" fill className="object-cover" />
                                <button 
                                  onClick={() => updateField('petImageUrl', '')}
                                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors"
                                >
                                   <X size={16} />
                                </button>
                              </>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center gap-2">
                                <Camera className="text-neutral-300 group-hover:text-primary transition-colors" size={32} />
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400">{t.crm.uploadPortrait}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                              </label>
                            )}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Pet Nickname */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                      {t.auth.petNickname} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3">
                      <input 
                        type="text" 
                        value={formData.petNickname}
                        onChange={e => updateField('petNickname', e.target.value)}
                        className="w-full h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none shadow-sm"
                      />
                    </div>
                 </div>

                 {/* Pet Type */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                      {t.auth.petType} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3 flex gap-12">
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petType" 
                            className="w-6 h-6 accent-primary" 
                            onChange={() => updateField('petType', 'cat')}
                          />
                          <span className="text-base font-bold text-neutral-700 group-hover:text-primary transition-colors">{language === 'th' ? 'แมว' : 'Cat'}</span>
                       </label>
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petType" 
                            className="w-6 h-6 accent-primary" 
                            onChange={() => updateField('petType', 'dog')}
                          />
                          <span className="text-base font-bold text-neutral-700 group-hover:text-primary transition-colors">{language === 'th' ? 'ลูกสุนัข' : 'Puppy'}</span>
                       </label>
                    </div>
                 </div>

                 {/* Pet Size */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                      {t.auth.petSize} <span className="text-red-500">*</span>
                    </label>
                    <div className="md:col-span-3 flex flex-wrap gap-10">
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petSize" 
                            className="w-6 h-6 accent-primary" 
                            onChange={() => updateField('petSize', 'small')}
                          />
                          <span className="text-base font-bold text-neutral-700 group-hover:text-primary transition-colors">{language === 'th' ? 'เล็ก' : 'Small'}</span>
                       </label>
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petSize" 
                            className="w-6 h-6 accent-primary" 
                            onChange={() => updateField('petSize', 'medium')}
                          />
                          <span className="text-base font-bold text-neutral-700 group-hover:text-primary transition-colors">{language === 'th' ? 'ขนาดกลาง' : 'Medium'}</span>
                       </label>
                       <label className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="petSize" 
                            className="w-6 h-6 accent-primary" 
                            onChange={() => updateField('petSize', 'large')}
                          />
                          <span className="text-base font-bold text-neutral-700 group-hover:text-primary transition-colors">{language === 'th' ? 'ขนาดใหญ่' : 'Large'}</span>
                       </label>
                    </div>
                 </div>

                 {/* Referral Code */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-t border-neutral-100 pt-10">
                    <label className="text-sm uppercase tracking-widest text-neutral-900 font-bold">
                      {t.auth.referralCode}
                    </label>
                    <div className="md:col-span-3">
                      <input 
                        type="text" 
                        value={formData.referralCode}
                        onChange={e => updateField('referralCode', e.target.value)}
                        className="w-full sm:w-64 h-16 bg-white border border-neutral-200 rounded-2xl px-6 text-lg text-primary outline-none shadow-sm"
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
