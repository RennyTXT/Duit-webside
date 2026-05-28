'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSettings } from '@/app/admin/actions/settings';
import { useLanguageStore, translations } from '@/store/useLanguageStore';

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

  const displayLinks = socialLinks.length > 0 ? socialLinks : [
    { icon: MessageCircle, href: '#', label: 'Line' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: X, href: '#', label: 'X' },
    { icon: Mail, href: 'mailto:contact@duit.in.th', label: 'Email' }
  ];

  return (
    <footer className="bg-white text-primary pt-24 pb-12 border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="inline-block hover:opacity-70 transition-opacity">
              <span className="font-greycliff text-4xl lowercase tracking-[-0.02em] text-primary">
                duit
              </span>
            </Link>
            <p className="text-sm text-secondary leading-relaxed max-w-sm">
              {settings?.mission_statement || t.footer.mission}
            </p>
            <div className="flex gap-4">
              {displayLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href || '#'} 
                  target={social.href && social.href.startsWith('http') ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors group"
                >
                  <social.icon size={16} className="text-secondary group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium">{t.footer.directory}</h4>
              <ul className="space-y-4 text-xs uppercase tracking-widest text-secondary">
                <li><Link href="/shop" className="hover:text-primary transition-colors">{t.shop.allProducts}</Link></li>
                <li><Link href="/duit-care" className="hover:text-primary transition-colors">{t.nav.care}</Link></li>
                <li><Link href="/news" className="hover:text-primary transition-colors">{t.nav.journal}</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">{t.nav.heritage}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium">{t.footer.support}</h4>
              <ul className="space-y-4 text-xs uppercase tracking-widest text-secondary">
                <li><Link href="/faq" className="hover:text-primary transition-colors">{t.footer.assistance}</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">{t.footer.logistics}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t.footer.concierge}</Link></li>
              </ul>
            </div>

            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-secondary font-medium">{t.footer.atelier}</h4>
              <div className="space-y-4 text-xs text-secondary leading-relaxed">
                <div className="flex gap-3">
                  <MapPin size={14} className="shrink-0 mt-0.5 opacity-40" />
                  <span>{settings?.address || "Siam Square One, 3rd Floor, Bangkok, Thailand"}</span>
                </div>
                <div className="flex gap-3">
                  <Phone size={14} className="shrink-0 opacity-40" />
                  <span>{settings?.phone || "+66 2 123 4567"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-neutral-50 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          <div className="flex items-center gap-4">
            <span>© 2026 {settings?.atelier_name || "DUIT TH THAILAND"}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-100"></span>
            <span>{t.footer.representative}</span>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
