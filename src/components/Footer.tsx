'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSettings } from '@/app/admin/actions/settings';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

// Custom high-quality SVG Icons for reliability
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        const data = await getSettings();
        if (data) setSettings(data);
      } catch (error) {
        console.error('Error loading footer settings:', error);
      }
    }
    fetchFooterSettings();
  }, []);

  const socialLinks = [
    { icon: MessageCircle, href: settings?.line_url, label: 'Line' },
    { icon: InstagramIcon, href: settings?.instagram_url, label: 'Instagram' },
    { icon: FacebookIcon, href: settings?.facebook_url, label: 'Facebook' },
    { icon: X, href: settings?.twitter_url, label: 'X' },
    { icon: Mail, href: settings?.official_email ? `mailto:${settings.official_email}` : null, label: 'Email' }
  ].filter(link => link.href && link.href !== '#');

  // Fallback for design consistency
  const displayLinks = socialLinks.length > 0 ? socialLinks : [
    { icon: MessageCircle, href: '#', label: 'Line' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: X, href: '#', label: 'X' },
    { icon: Mail, href: 'mailto:contact@duit.in.th', label: 'Email' }
  ];

  return (
    <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          <div className="lg:col-span-5 space-y-12">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-500">
              <span className="font-greycliff text-4xl lowercase tracking-[-0.02em] text-white">
                duit
              </span>
            </Link>
            <p className="text-lg text-neutral-400 font-medium leading-relaxed max-w-md opacity-80">
              {settings?.mission_statement || t.footer.mission}
            </p>
            <div className="flex gap-6">
              {displayLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href || '#'} 
                  target={social.href && social.href.startsWith('http') ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent-gold hover:text-white transition-all duration-500 group shadow-luxury"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">{t.footer.directory}</h4>
              <ul className="space-y-5 text-xs uppercase tracking-widest text-neutral-400">
                <li><Link href="/shop" className="hover:text-white transition-colors">{t.shop.allProducts}</Link></li>
                <li><Link href="/duit-care" className="hover:text-white transition-colors">{t.nav.care}</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">{t.nav.journal}</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">{t.nav.heritage}</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">{t.footer.support}</h4>
              <ul className="space-y-5 text-xs uppercase tracking-widest text-neutral-400">
                <li><Link href="/faq" className="hover:text-white transition-colors">{t.footer.assistance}</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">{t.footer.logistics}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">{t.footer.concierge}</Link></li>
                <li><Link href="/admin" className="text-accent-gold/40 hover:text-accent-gold transition-colors">{t.nav.admin}</Link></li>
              </ul>
            </div>

            <div className="space-y-8 col-span-2 md:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">{t.footer.atelier}</h4>
              <div className="space-y-6 text-xs font-medium text-neutral-400 leading-relaxed">
                <div className="flex gap-4">
                  <MapPin size={16} className="text-accent-gold shrink-0" />
                  <span>{settings?.address || "Siam Square One, 3rd Floor, Bangkok, Thailand"}</span>
                </div>
                <div className="flex gap-4">
                  <Phone size={16} className="text-accent-gold shrink-0" />
                  <span>{settings?.phone || "+66 2 123 4567"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] uppercase tracking-[0.3em] text-neutral-500">
          <div className="flex items-center gap-4">
            <span>© 2026 {settings?.atelier_name || "DUIT TH THAILAND"}</span>
            <span className="w-1 h-1 rounded-full bg-white/10"></span>
            <span className="text-accent-gold/40">{t.footer.representative}</span>
          </div>
          <div className="flex gap-10">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
