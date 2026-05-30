'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Search, Menu, X, ChevronDown, Star, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore, translations } from '@/store/useLanguageStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { usePetStore } from '@/store/usePetStore';
import { createClient } from '@/lib/supabase/client';
import { LanguageSwitcher } from './LanguageSwitcher';
import ArchiveSidebar from './ArchiveSidebar';
import SearchOverlay from './SearchOverlay';
const Header = () => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const pathname = usePathname();
  const { items } = useWishlistStore();
  const { clearProfile } = usePetStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isHomePage = pathname === '/';
  const shouldShowSolid = !isHomePage || isScrolled;
  
  // เนื่องจากหน้าแรกมี Frame สีขาวด้านบน ตัวหนังสือ Header ควรเป็นสีเข้มเสมอเพื่อให้มองเห็นได้ชัดเจน
  const useDarkText = true; 

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const supabase = createClient();
    
    // Check initial user session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [lastScrollY]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearProfile();
    window.location.href = '/';
  };

  const navLinks = [
    { name: t.nav.collections, href: '/shop' },
    { name: t.nav.care, href: '/duit-care' },
    { name: t.nav.journal, href: '/news' },
    { name: t.nav.heritage, href: '/about' },
  ];

  return (
    <>
      <motion.header 
        initial={false}
        animate={{ 
          y: 0,
          opacity: 1
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className={`fixed top-0 w-full z-[90] transition-all duration-500 ${shouldShowSolid ? 'bg-white border-b border-neutral-50 h-20' : 'bg-transparent h-24'}`}
      >
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 h-full flex items-center">
          {/* Left: Logo */}
          <div className="flex-1">
            <Link href="/" className="inline-block transition-all duration-700 hover:scale-105 active:scale-95">
              <span className="font-greycliff text-3xl lowercase tracking-[-0.02em] text-primary">
                duit
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-8 transition-colors duration-700 ${useDarkText ? 'text-secondary' : 'text-white/70'}`}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`hover:text-accent-gold transition-colors whitespace-nowrap relative group py-2 uppercase ${language === 'th' ? 'text-[14px] font-medium tracking-wide' : 'text-[11px] tracking-[0.3em]'} ${useDarkText ? 'text-secondary' : 'text-white/70'}`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-gold transition-all duration-500 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right: Action Icons */}
          <div className={`flex-1 flex items-center justify-end gap-2 md:gap-4 transition-colors duration-700 ${useDarkText ? 'text-primary' : 'text-white'}`}>
            <LanguageSwitcher />
            
            <div className="h-4 w-px bg-neutral-100 mx-2 hidden md:block" />

            {/* Archive Trigger */}
            <button 
              onClick={() => setIsArchiveOpen(true)}
              className={`p-2 rounded-full transition-all group relative ${shouldShowSolid ? 'hover:bg-neutral-50' : 'hover:bg-white/10'}`}
            >
              <Star size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {isMounted && items.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-3.5 h-3.5 bg-accent-gold text-white text-[7px] flex items-center justify-center rounded-full shadow-sm font-bold"
                  >
                    {items.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-full transition-all group ${shouldShowSolid ? 'hover:bg-neutral-50' : 'hover:bg-white/10'}`}
            >
              <Search size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/pet-profile" className={`p-2 rounded-full transition-all group ${shouldShowSolid ? 'hover:bg-primary hover:text-white' : 'hover:bg-white/10'}`}>
                  <User size={16} strokeWidth={1.5} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition-all group ${shouldShowSolid ? 'hover:bg-red-500 hover:text-white' : 'hover:bg-red-500/20 text-red-500'}`}
                  title={t.common.logout}
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 ml-2">
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all font-medium ${shouldShowSolid ? 'text-primary hover:bg-neutral-50' : 'text-primary hover:bg-white/10'}`}
                >
                  {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                </Link>
                <Link 
                  href="/register" 
                  className={`px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${shouldShowSolid ? 'bg-primary text-white hover:bg-accent-gold shadow-sm' : 'bg-primary text-white hover:bg-neutral-900'}`}
                >
                  {language === 'th' ? 'สมัครสมาชิก' : 'Register'}
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className={`lg:hidden p-2 rounded-full transition-all hover:bg-neutral-100`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-[400px] bg-white z-[101] lg:hidden shadow-luxury flex flex-col border-l border-neutral-100"
            >
              <div className="p-8 flex justify-between items-center border-b border-neutral-50">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">{t.common.directory}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors">
                  <X size={20} strokeWidth={1} />
                </button>
              </div>
              <nav className="flex flex-col p-10 gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-2xl uppercase tracking-tighter text-primary hover:text-accent-gold p-4 rounded-3xl hover:bg-cream-light transition-all flex items-center justify-between group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown size={20} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-10 border-t border-neutral-50 bg-cream-light/30">
                <Link 
                  href="/pet-profile" 
                  className="flex items-center gap-4 p-6 bg-primary text-white rounded-[32px] shadow-luxury transition-transform active:scale-95"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><User size={20} strokeWidth={1.5} /></div>
                  <span className="uppercase tracking-[0.2em] text-xs">{t.common.petPortfolio}</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ArchiveSidebar isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
