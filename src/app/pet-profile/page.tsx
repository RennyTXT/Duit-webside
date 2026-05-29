'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { usePetStore, PetType, PetSize } from '@/store/usePetStore';
import { useRouter } from 'next/navigation';
import { Trash2, Dog, Cat, Sparkles, ChevronRight, Loader2, Award, QrCode, ShieldCheck, Gift, Clock, CreditCard, Star, MapPin, Camera, Upload, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { dogBreeds, catBreeds } from '@/data/breeds';
import { products as staticProducts, Product } from '@/data/products';
import { useLanguageStore, translations } from '@/store/useLanguageStore';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

// --- REFINED LUXURY 3D CARD COMPONENT ---
const LuxuryCard = ({ profile, tier, points, t }: { profile: any, tier: string, points: number, t: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const shineOpacity = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.3, 0, 0.3]);
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["-150%", "150%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cardImage = "https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440";

  return (
    <div 
      className="perspective-2000 w-full max-w-[550px] aspect-[1.58/1] mx-auto cursor-pointer relative touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0d0d0d] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] border border-white/10 transition-shadow duration-500"
      >
        <div className="absolute inset-0 z-0">
          <Image src={cardImage} alt="Card Texture" fill className="object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80" />
        </div>

        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            opacity: shineOpacity,
            left: shineX,
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 80%)",
            width: "200%",
            transform: "skewX(-20deg)",
          }}
        />

        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-20" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
          <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
            <div className="flex items-center gap-6">
              {/* Pet Photo on Card */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-accent-gold/50 relative bg-neutral-900 shadow-xl">
                {profile?.imageUrl ? (
                  <Image src={profile.imageUrl} alt="Pet" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent-gold/20">
                    {profile?.type === 'cat' ? <Cat size={32} /> : <Dog size={32} />}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-1 h-1 rounded-full bg-accent-gold" />
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.4em] text-accent-gold">{t.crm.memberCard}</span>
                </div>
                <h3 className="text-xl sm:text-3xl uppercase tracking-tight text-white">{profile?.name || "GUEST"}</h3>
              </div>
            </div>
            <Award className="text-accent-gold/80 w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1} />
          </div>

          <div className="space-y-4 sm:space-y-8" style={{ transform: "translateZ(30px)" }}>
            <div className="flex gap-8 sm:gap-12">
               <div className="space-y-1">
                 <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-neutral-500">{t.crm.tierLevel}</span>
                 <span className="text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-[#f3e2b4] to-accent-gold tracking-[0.1em] uppercase">{tier}</span>
               </div>
               <div className="space-y-1">
                 <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-neutral-500">{t.crm.points}</span>
                 <span className="text-lg sm:text-2xl text-white tracking-tight">{points.toLocaleString()}</span>
               </div>
            </div>
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
               <span className="text-[7px] sm:text-[8px] text-neutral-500 uppercase tracking-[0.2em]">{t.crm.verifiedOwner}</span>
               <div className="text-[7px] sm:text-[8px] font-mono text-white/20 tracking-[0.3em]">PRIME-8824</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] border border-white/5 pointer-events-none z-30" />
      </motion.div>
      <motion.div 
        className="absolute -bottom-4 left-6 right-6 h-8 bg-black/50 blur-[20px] rounded-full -z-10"
        style={{
          opacity: useTransform(mouseYSpring, [-0.5, 0.5], [0.3, 0.7]),
          scale: useTransform(mouseXSpring, [-0.5, 0.5], [0.95, 1.05]),
        }}
      />
    </div>
  );
};

export default function PetProfilePage() {
  const { profile, setProfile, clearProfile } = usePetStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  
  const supabase = createClient();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        clearProfile(); // ล้างข้อมูลสัตว์เลี้ยงในเครื่องทันที
        router.push('/login');
      } else {
        setIsLoadingAuth(false);
      }
    }
    checkUser();
  }, [router, supabase, clearProfile]);

  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'registry'>('profile');
  const [step, setStep] = useState(profile ? 5 : 1);

  const [name, setName] = useState(profile?.name || '');
  const [type, setType] = useState<PetType>(profile?.type || null);
  const [breed, setBreed] = useState(profile?.breed || '');
  const [size, setSize] = useState<PetSize>(profile?.size || null);
  const [imageUrl, setImageUrl] = useState(profile?.imageUrl || '');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiInsights, setAiInsights] = useState<{title: string, reason: string, products: Product[]} | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearProfile(); // ล้างข้อมูลสัตว์เลี้ยงเมื่อ Logout
    toast.success('Signed out successfully');
    window.location.href = '/';
  };

  const breeds = type === 'dog' ? dogBreeds : type === 'cat' ? catBreeds : [];

  const themeColors = useMemo(() => {
    if (type === 'cat') return { accent: 'text-accent-gold', bg: 'bg-[#faf7f2]', card: 'bg-white' };
    if (type === 'dog') return { accent: 'text-blue-600', bg: 'bg-[#f0f4f8]', card: 'bg-white' };
    return { accent: 'text-accent-gold', bg: 'bg-white', card: 'bg-white' };
  }, [type]);

  useEffect(() => {
    if (profile && !aiInsights && step === 5) {
      runAIAnalysis();
    }
  }, [profile, step]);

  const sortedBreeds = useMemo(() => {
    return [...breeds].sort((a, b) => {
      const nameA = language === 'th' ? a.th : a.en;
      const nameB = language === 'th' ? b.th : b.en;
      return nameA.localeCompare(nameB, language === 'th' ? 'th' : 'en');
    });
  }, [breeds, language]);

  const sizeOptions = useMemo(() => {
    if (type === 'dog') {
      return [
        { value: 'small', label: language === 'th' ? 'ขนาดเล็ก (< 10 กก.)' : 'Small (< 10kg)' },
        { value: 'medium', label: language === 'th' ? 'ขนาดกลาง (10-25 กก.)' : 'Average (10-25kg)' },
        { value: 'large', label: language === 'th' ? 'ขนาดใหญ่ (> 25 กก.)' : 'Big (> 25kg)' },
      ];
    } else {
      return [
        { value: 'small', label: language === 'th' ? 'ขนาดเล็ก (< 3.5 กก.)' : 'Small (< 3.5kg)' },
        { value: 'medium', label: language === 'th' ? 'ขนาดปกติ (3.6-5.5 กก.)' : 'Average (3.6-5.5kg)' },
        { value: 'large', label: language === 'th' ? 'ขนาดใหญ่ (> 5.5 กก.)' : 'Big (> 5.5kg)' },
      ];
    }
  }, [type, language]);

  const [isSaving, setIsSaving] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [memberTier, setMemberTier] = useState('Silver');
  const [memberPoints, setMemberPoints] = useState(0);

  useEffect(() => {
    const fetchProfileAndPet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserEmail(user.email || null);

      // 1. Fetch User Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setMemberTier(profileData.tier || 'Silver');
        setMemberPoints(profileData.duit_coins || 0);
        // ถ้าต้องการอัปเดตชื่อผู้ใช้จากโปรไฟล์
        if (profileData.full_name && !name) {
           //SetName(profileData.full_name); // อาจจะไม่ต้องทำถ้าเราเน้นชื่อสัตว์เลี้ยง
        }
      }

      // 2. Fetch Pet Data
      const { data: petData } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (petData) {
        setName(petData.name);
        setType(petData.type as PetType);
        setBreed(petData.breed || '');
        setSize(petData.size as PetSize);
        setImageUrl(petData.image_url || '');
        
        // Update local store as well
        setProfile({ 
          name: petData.name, 
          type: petData.type as PetType, 
          breed: petData.breed || '', 
          size: petData.size as PetSize, 
          age: null, 
          imageUrl: petData.image_url || '' 
        });
        
        setStep(5);
        runAIAnalysis();
      }
    };

    fetchProfileAndPet();
  }, [supabase, setProfile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'th' ? 'รูปภาพต้องมีขนาดไม่เกิน 5MB' : 'Image must be under 5MB');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success(language === 'th' ? 'อัปโหลดรูปภาพสำเร็จ' : 'Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    if (!name || !type || !breed || !size) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      // 1. Update Profile (Sync name)
      await supabase.from('profiles').update({ full_name: name }).eq('id', user.id);

      // 2. Upsert Pet Data
      const petData = {
        owner_id: user.id,
        name,
        type,
        breed,
        size,
        image_url: imageUrl,
      };

      const { error } = await supabase.from('pets').upsert([petData], { onConflict: 'owner_id' });
      if (error) throw error;

      setProfile({ name, type, breed, size, age: null, imageUrl });
      setStep(5);
      runAIAnalysis();
      toast.success(language === 'th' ? 'บันทึกข้อมูลเรียบร้อย' : 'Profile saved successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setShowAnalysis(true);
    setTimeout(() => {
      // Logic to filter and prioritize products for AI recommendation
      const recommended = [...staticProducts]
        .filter(p => {
          if (!p.recommendedFor) return true;
          // Filter by type (cat/dog)
          const typeMatch = !p.recommendedFor.type || p.recommendedFor.type === type;
          // Filter by size
          const sizeMatch = !p.recommendedFor.size || p.recommendedFor.size === size;
          return typeMatch && sizeMatch;
        })
        // Sort to ensure variety or priority (e.g., best sellers or new products)
        .sort((a, b) => {
          if (a.isBest && !b.isBest) return -1;
          if (!a.isBest && b.isBest) return 1;
          return 0;
        })
        .slice(0, 6); // Limit to exactly 6 products as requested

      setAiInsights({
        title: t.crm.identitySynthesis,
        reason: language === 'th' ? `จากการวิเคราะห์ลักษณะเฉพาะของสายพันธุ์และรูปแบบการใช้ชีวิต AI ของเราจัดหมวดหมู่ ${name} เป็น "Refined Explorer" ที่เหมาะกับงานดีไซน์เน้นการยศาสตร์สูงสุด` : `Based on breed characteristics and lifestyle patterns, our AI classifies ${name} as a "Refined Explorer" best suited for ergonomically-focused designs.`,
        products: recommended
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-t-2 border-accent-gold rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-300">Authenticating Experience...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen text-primary transition-colors duration-1000 ${themeColors.bg}`}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <Image src="https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1440" fill className="object-cover" alt="" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 sm:pt-40 pb-20 sm:pb-40 relative z-10">
        <AnimatePresence mode="wait">
          {step < 5 && (
            <motion.div key="onboarding" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto space-y-12 sm:space-y-24 py-10 sm:py-20">
              {step === 1 && (
                <div className="text-center space-y-8 sm:space-y-12">
                   <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-cream-light rounded-full flex items-center justify-center text-accent-gold"><Sparkles className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                   </motion.div>
                   <div className="space-y-4 sm:space-y-6">
                      <h1 className="text-4xl sm:text-6xl md:text-8xl uppercase tracking-tighter leading-none">{t.crm.welcomeTitle} <br /> <span className="text-accent-gold italic">Duit Atelier.</span></h1>
                      <p className="text-base sm:text-xl text-secondary font-medium max-w-xl mx-auto opacity-70 px-4">{t.crm.welcomeSubtitle}</p>
                   </div>
                   <button onClick={() => setStep(2)} className="bg-primary text-white px-10 sm:px-16 py-5 sm:py-8 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.4em] hover:bg-accent-gold transition-all shadow-xl active:scale-95">
                      {t.crm.initDiscovery}
                   </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-12 sm:space-y-20">
                   <div className="text-center space-y-2 sm:space-y-4">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">{t.crm.stage01}</span>
                      <h2 className="text-3xl sm:text-5xl uppercase tracking-tight">{t.crm.definePet}</h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 px-4 sm:px-0">
                      <button onClick={() => { setType('dog'); setStep(3); }} className="group aspect-video sm:aspect-square bg-white border border-neutral-100 rounded-[32px] sm:rounded-[64px] flex flex-row sm:flex-col items-center justify-center gap-6 sm:gap-8 hover:bg-primary transition-all duration-700 shadow-sm active:scale-95">
                         <div className="w-16 h-16 sm:w-32 sm:h-32 bg-neutral-50 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Dog className="w-8 h-8 sm:w-16 sm:h-16" strokeWidth={1} /></div>
                         <span className="text-xs sm:text-sm uppercase tracking-[0.4em] group-hover:text-white transition-colors">{t.crm.dog}</span>
                      </button>
                      <button onClick={() => { setType('cat'); setStep(3); }} className="group aspect-video sm:aspect-square bg-white border border-neutral-100 rounded-[32px] sm:rounded-[64px] flex flex-row sm:flex-col items-center justify-center gap-6 sm:gap-8 hover:bg-primary transition-all duration-700 shadow-sm active:scale-95">
                         <div className="w-16 h-16 sm:w-32 sm:h-32 bg-neutral-50 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Cat className="w-8 h-8 sm:w-16 sm:h-16" strokeWidth={1} /></div>
                         <span className="text-xs sm:text-sm uppercase tracking-[0.4em] group-hover:text-white transition-colors">{t.crm.cat}</span>
                      </button>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="max-w-2xl mx-auto space-y-12 sm:space-y-16 px-4">
                   <div className="text-center space-y-2 sm:space-y-4">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">Stage 02</span>
                      <h2 className="text-3xl sm:text-5xl uppercase tracking-tight">{language === 'th' ? 'ภาพลักษณ์ของน้อง' : 'The Visual Identity.'}</h2>
                   </div>
                   <div className="flex flex-col items-center gap-12">
                      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[48px] overflow-hidden border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center group hover:border-accent-gold transition-colors">
                        {imageUrl ? (
                          <>
                            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                            <button onClick={() => setImageUrl('')} className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-colors">
                               <X size={20} />
                            </button>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-neutral-300 group-hover:text-accent-gold shadow-sm transition-colors">
                               <Camera size={32} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">{language === 'th' ? 'อัปโหลดรูปภาพ' : 'Upload Portrait'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                        )}
                      </div>
                      <div className="flex gap-4 w-full">
                         <button onClick={() => setStep(2)} className="flex-1 h-16 rounded-full border border-neutral-100 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-50 transition-colors">Back</button>
                         <button onClick={() => setStep(4)} className="flex-[2] h-16 bg-primary text-white rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-accent-gold transition-all shadow-lg">{language === 'th' ? 'ขั้นตอนถัดไป' : 'Proceed'}</button>
                      </div>
                   </div>
                </div>
              )}

              {step === 4 && (
                <div className="max-w-2xl mx-auto space-y-12 sm:space-y-16 px-4">
                   <div className="text-center space-y-2 sm:space-y-4">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">Stage 03</span>
                      <h2 className="text-3xl sm:text-5xl uppercase tracking-tight">{t.crm.detailedPortfolio}</h2>
                   </div>
                   <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.4em] text-neutral-300 ml-4 sm:ml-8">{t.crm.officialName}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-16 sm:h-24 bg-transparent border-b border-neutral-200 text-xl sm:text-3xl uppercase tracking-tight outline-none px-4 sm:px-8 focus:border-accent-gold transition-colors" placeholder="..." />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.4em] text-neutral-300 ml-4 sm:ml-8">{t.crm.heritage}</label>
                            <select value={breed} onChange={e => setBreed(e.target.value)} className="w-full h-12 sm:h-16 bg-transparent border-b border-neutral-200 text-base sm:text-lg outline-none">
                               <option value="">{t.crm.selectBreed}</option>
                               {sortedBreeds.map(b => <option key={b.en} value={b.en}>{language === 'th' ? b.th : b.en}</option>)}
                            </select>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.4em] text-neutral-300 ml-4 sm:ml-8">{t.crm.classification}</label>
                            <select value={size || ''} onChange={e => setSize(e.target.value as PetSize)} className="w-full h-12 sm:h-16 bg-transparent border-b border-neutral-200 text-base sm:text-lg outline-none">
                               <option value="">{t.crm.selectSize}</option>
                               {sizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => setStep(3)} className="w-20 h-16 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50"><ArrowLeftIcon size={20} /></button>
                         <button onClick={handleSave} className="flex-grow bg-primary text-white py-5 sm:py-8 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.4em] hover:bg-accent-gold transition-all shadow-xl active:scale-95">{t.crm.generate}</button>
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 sm:space-y-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center px-4 sm:px-0">
                 <div className="space-y-8 sm:space-y-12 text-center lg:text-left">
                    <div className="space-y-4 sm:space-y-6">
                       <div className="flex items-center justify-center lg:justify-start gap-4">
                          <div className={`h-px w-8 sm:w-12 ${type === 'dog' ? 'bg-blue-600' : 'bg-accent-gold'}`}></div>
                          <span className={`${type === 'dog' ? 'text-blue-600' : 'text-accent-gold'} text-[10px] uppercase tracking-[0.4em]`}>{t.crm.memberCard}</span>
                       </div>
                       <h1 className="text-4xl sm:text-6xl md:text-[100px] uppercase tracking-tighter leading-[0.85]">{t.crm.memberPavilion.split(' ')[0]} <br /> <span className={`${type === 'dog' ? 'text-blue-600' : 'text-accent-gold'} italic`}>{t.crm.memberPavilion.split(' ')[1] || 'Pavilion.'}</span></h1>
                       <p className="text-base sm:text-lg text-secondary font-medium leading-relaxed max-w-md mx-auto lg:mx-0 opacity-70">{t.crm.dashboardSubtitle}</p>
                    </div>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2">
                       <button onClick={() => setActiveTab('profile')} className={`px-6 sm:px-10 py-3 sm:py-5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-primary text-white shadow-xl' : 'bg-white/50 text-neutral-400 hover:bg-white'}`}>{t.crm.tabPersona}</button>
                       <button onClick={() => setActiveTab('registry')} className={`px-6 sm:px-10 py-3 sm:py-5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'registry' ? 'bg-primary text-white shadow-xl' : 'bg-white/50 text-neutral-400 hover:bg-white'}`}>{t.crm.tabCollection}</button>
                       <button onClick={() => setActiveTab('rewards')} className={`px-6 sm:px-10 py-3 sm:py-5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === 'rewards' ? 'bg-primary text-white shadow-xl' : 'bg-white/50 text-neutral-400 hover:bg-white'}`}>{t.crm.tabPrivileges}</button>
                    </div>
                 </div>
                 <LuxuryCard profile={profile} tier={memberTier} points={memberPoints} t={t} />
              </div>

              <div className="pt-16 sm:pt-24 border-t border-neutral-100">
                 {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 px-4 sm:px-0">
                       <div className="space-y-8 sm:space-y-12">
                          <div className="space-y-6">
                             <h2 className="text-3xl sm:text-4xl uppercase tracking-tight">{t.crm.identitySynthesis}</h2>
                             <div className={`${themeColors.card} p-8 sm:p-12 rounded-[32px] sm:rounded-[48px] border border-neutral-100 relative overflow-hidden shadow-sm`}>
                                <Sparkles className={`absolute top-4 right-4 sm:top-8 sm:right-8 ${type === 'dog' ? 'text-blue-600/10' : 'text-accent-gold/20'} w-[60px] h-[60px] sm:w-[100px] sm:h-[100px]`} />
                                <div className="space-y-6 sm:space-y-8 relative z-10">
                                   <div className="flex gap-8 items-center">
                                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-accent-gold/20 relative shadow-lg">
                                        {profile?.imageUrl ? <Image src={profile.imageUrl} alt="Pet" fill className="object-cover" /> : <div className="w-full h-full bg-neutral-50 flex items-center justify-center text-neutral-200">{type === 'dog' ? <Dog size={48} /> : <Cat size={48} />}</div>}
                                      </div>
                                      <div className="space-y-2 sm:space-y-4">
                                         <span className={`text-[10px] uppercase tracking-[0.3em] ${type === 'dog' ? 'text-blue-600' : 'text-accent-gold'}`}>{t.crm.aiResult}</span>
                                         <h3 className="text-xl sm:text-2xl uppercase">{aiInsights?.title}</h3>
                                      </div>
                                   </div>
                                   <p className="text-base sm:text-lg text-secondary font-medium leading-relaxed italic">"{aiInsights?.reason}"</p>
                                   <div className="flex flex-wrap gap-6 sm:gap-8">
                                      <div className="text-left">
                                         <span className="block text-[8px] text-neutral-400 uppercase tracking-widest mb-2">Energy Level</span>
                                         <div className="flex gap-1">
                                            {[1,2,3,4,5].map(i => <div key={i} className={`w-4 sm:w-6 h-1 rounded-full ${i <= 4 ? (type === 'dog' ? 'bg-blue-600' : 'bg-accent-gold') : 'bg-neutral-200'}`}></div>)}
                                         </div>
                                      </div>
                                      <div className="text-left">
                                         <span className="block text-[8px] text-neutral-400 uppercase tracking-widest mb-1">Design Preference</span>
                                         <span className="text-[10px] uppercase tracking-widest">MINIMALIST</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                            {userEmail && [
                              's6606021610117@email.kmutnb.ac.th',
                              'donut2548donut@gmail.com'
                            ].includes(userEmail) && (
                              <Link href="/admin" className="flex items-center gap-3 text-accent-gold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all">
                                <ShieldCheck size={16} /> Atelier Management
                              </Link>
                            )}
                            <button onClick={() => { clearProfile(); setStep(1); setImageUrl(''); }} className="flex items-center gap-3 text-red-500 text-[10px] uppercase tracking-[0.2em] hover:translate-x-2 transition-all"><Trash2 size={16} /> {t.crm.resetProfile}</button>
                            <button onClick={handleLogout} className="flex items-center gap-3 text-neutral-400 text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-all"><LogOut size={16} /> Sign Out</button>
                          </div>
                       </div>
                       <div className="space-y-8 sm:space-y-12">
                          <h2 className="text-3xl sm:text-4xl uppercase tracking-tight">{t.crm.bespokeCuration}</h2>
                          <div className="grid grid-cols-1 gap-4 sm:gap-6">
                             {aiInsights?.products.map(p => (
                                <Link key={p.id} href={`/products/${p.id}`} className="group flex items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-white border border-neutral-100 rounded-[24px] sm:rounded-[40px] hover:border-accent-gold hover:shadow-luxury transition-all active:scale-[0.98]">
                                   <div className="w-20 h-20 sm:w-32 sm:h-32 bg-neutral-50 rounded-2xl sm:rounded-3xl overflow-hidden relative shrink-0"><Image src={p.image} alt={p.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-700" /></div>
                                   <div className="space-y-1">
                                      <span className={`text-[8px] sm:text-[9px] ${type === 'dog' ? 'text-blue-600' : 'text-accent-gold'} uppercase tracking-[0.2em]`}>{t.crm.recommended}</span>
                                      <h4 className="text-base sm:text-xl uppercase tracking-tight line-clamp-1">{p.name}</h4>
                                      <p className="text-[10px] sm:text-sm text-secondary font-medium opacity-60">Design for refined aesthetics</p>
                                   </div>
                                   <div className="ml-auto w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                </Link>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'registry' && (
                    <div className="max-w-4xl mx-auto space-y-12 text-center py-10 sm:py-20 px-4">
                       <div className={`w-20 h-20 sm:w-32 sm:h-32 ${type === 'dog' ? 'bg-blue-50 text-blue-600' : 'bg-cream-light text-accent-gold'} rounded-full flex items-center justify-center mx-auto mb-8`}><ShieldCheck className="w-10 h-10 sm:w-16 sm:h-16" strokeWidth={1} /></div>
                       <h2 className="text-3xl sm:text-4xl uppercase tracking-tight">{t.crm.managedCollection}</h2>
                       <p className="text-sm sm:text-lg text-secondary max-w-md mx-auto">{t.crm.collectionSubtitle}</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left mt-10 sm:mt-16">
                          <div className="p-8 sm:p-10 border border-neutral-100 rounded-[32px] sm:rounded-[48px] bg-white/50 space-y-4 shadow-sm">
                             <h4 className="text-lg sm:text-xl uppercase">Duit The Table</h4>
                             <p className="text-[10px] sm:text-xs text-green-600 tracking-widest uppercase">Warranty Active</p>
                          </div>
                          <button className="p-8 sm:p-10 border-2 border-dashed border-neutral-200 rounded-[32px] sm:rounded-[48px] flex flex-col items-center justify-center gap-4 hover:border-accent-gold hover:bg-white/50 transition-all text-neutral-300 hover:text-accent-gold active:scale-95">
                             <QrCode className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1} />
                             <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">{t.crm.registerNew}</span>
                          </button>
                       </div>
                    </div>
                 )}

                 {activeTab === 'rewards' && (
                    <div className="max-w-4xl mx-auto py-20 sm:py-40 text-center space-y-8 sm:space-y-12 px-4">
                       <Gift className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-neutral-200" />
                       <div className="space-y-4">
                          <h2 className="text-2xl sm:text-3xl uppercase tracking-tight text-neutral-300">{t.crm.privilegesPending}</h2>
                          <p className="text-sm sm:text-base text-secondary opacity-40">{t.crm.invitationPending}</p>
                       </div>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
