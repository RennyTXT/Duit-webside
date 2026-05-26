'use client';

import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  ShieldCheck, 
  Palette,
  Camera,
  MessageCircle,
  X as XIcon,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSettings, updateSettings } from '../actions/settings';

// Custom Icons to avoid Lucide version issues
const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    atelier_name: 'DUIT TH THAILAND',
    brand_slogan: 'DESIGNED FOR BETTER LIVING.',
    mission_statement: 'Redefining the boundaries of pet living through architectural precision and enduring aesthetic value.',
    official_email: 'contact@duit.in.th',
    phone: '+66 2 123 4567',
    address: 'Siam Square One, 3rd Floor, Bangkok, Thailand',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    line_url: ''
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to load settings');
      } finally {
        setIsFetching(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSettings(settings);
      toast.success('Configuration synchronized successfully');
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'social', name: 'Social Media', icon: MessageCircle },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: ShieldCheck },
  ];

  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-accent-gold" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Accessing Metadata...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-accent-gold/40"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Configuration</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-0.04em] uppercase text-primary">Settings</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-4 bg-primary text-white px-8 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-luxury hover:bg-accent-gold transition-all duration-500 active:scale-95 disabled:opacity-50 group"
        >
           {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
           <span>{isLoading ? 'Synchronizing...' : 'Save Configuration'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[40px] border border-neutral-50 shadow-luxury p-6 sticky top-32">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${isActive ? 'bg-primary text-white shadow-lg translate-x-2' : 'text-neutral-400 hover:bg-neutral-50 hover:text-primary'}`}
                  >
                    <tab.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-accent-gold' : ''} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-white rounded-[56px] border border-neutral-50 shadow-luxury p-10 md:p-16">
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-primary">General Atelier Identity</h3>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed">Define how your brand appears across the digital platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-4">Atelier Name</label>
                    <input type="text" value={settings.atelier_name} onChange={(e) => setSettings({...settings, atelier_name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl px-8 py-5 text-sm font-bold focus:border-accent-gold outline-none transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-4">Brand Slogan</label>
                    <input type="text" value={settings.brand_slogan} onChange={(e) => setSettings({...settings, brand_slogan: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl px-8 py-5 text-sm font-bold focus:border-accent-gold outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-4">Mission Statement</label>
                    <textarea rows={4} value={settings.mission_statement} onChange={(e) => setSettings({...settings, mission_statement: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-[32px] px-8 py-6 text-sm font-medium focus:border-accent-gold outline-none transition-colors resize-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-primary">Concierge & Logistics</h3>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed">Official communication channels for client support.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 flex items-center gap-6">
                    <div className="w-14 h-14 bg-cream-light rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-neutral-50"><Mail size={20} strokeWidth={1.5} /></div>
                    <div className="flex-grow space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-2">Official Email</label>
                       <input type="email" value={settings.official_email} onChange={(e) => setSettings({...settings, official_email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-accent-gold outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-4 flex items-center gap-6">
                    <div className="w-14 h-14 bg-cream-light rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-neutral-50"><Phone size={20} strokeWidth={1.5} /></div>
                    <div className="flex-grow space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-2">Assistance Line</label>
                       <input type="text" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-accent-gold outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4 flex items-start gap-6">
                    <div className="w-14 h-14 bg-cream-light rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-neutral-50 mt-2"><MapPin size={20} strokeWidth={1.5} /></div>
                    <div className="flex-grow space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-2">Headquarters Address</label>
                       <textarea rows={2} value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 text-sm font-medium focus:border-accent-gold outline-none transition-colors resize-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-primary">Social Sphere</h3>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed">Manage your presence across global networks.</p>
                </div>
                <div className="space-y-8">
                  {[
                    { key: 'instagram_url', name: 'Instagram', icon: InstagramIcon, color: 'text-pink-500' },
                    { key: 'facebook_url', name: 'Facebook', icon: FacebookIcon, color: 'text-blue-600' },
                    { key: 'twitter_url', name: 'X / Twitter', icon: XIcon, color: 'text-primary' },
                    { key: 'line_url', name: 'Line Official', icon: MessageCircle, color: 'text-green-500' },
                  ].map((social) => (
                    <div key={social.name} className="flex items-center gap-8 p-6 bg-neutral-50/50 rounded-[32px] border border-neutral-100 group hover:bg-white hover:shadow-lg transition-all duration-500">
                      <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center ${social.color} shadow-sm border border-neutral-50`}>
                        <social.icon size={24} />
                      </div>
                      <div className="flex-grow space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">{social.name}</p>
                        <input type="text" value={(settings as any)[social.key] || ''} onChange={(e) => setSettings({...settings, [social.key]: e.target.value})} placeholder={`Enter ${social.name} URL...`} className="w-full bg-transparent border-none p-0 text-sm font-bold text-primary outline-none focus:text-accent-gold transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-primary">Aesthetic Curation</h3>
                  <p className="text-xs font-bold text-accent-gold uppercase tracking-widest">Available in next firmware update</p>
               </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <h3 className="text-2xl font-black uppercase tracking-tight text-primary">Access Architecture</h3>
                <p className="text-xs font-bold text-accent-gold uppercase tracking-widest">Available in next firmware update</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
