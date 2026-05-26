'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  TicketPercent, 
  LogOut, 
  Settings, 
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCheckingAuth, setIsFetchingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/admin/login') {
        setIsFetchingAuth(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setIsFetchingAuth(false);
      }
    }
    checkAuth();
  }, [pathname, router, supabase.auth]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Establishing Secure Session...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sign out successful');
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Masterpieces', href: '/admin/products', icon: Package },
    { name: 'Privileges', href: '/admin/promotions', icon: TicketPercent },
    { name: 'TH Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex text-primary font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 100 : 320,
          x: isSidebarOpen ? 0 : -320
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-neutral-100 shadow-luxury flex flex-col overflow-hidden"
      >
        <div className={`h-24 flex items-center border-b border-neutral-50 bg-cream-light/30 transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'px-10'}`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
               <span className="font-black text-xs">D</span>
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-black tracking-[-0.05em]"
              >
                DUIT <span className="text-accent-gold italic">TH</span>
              </motion.span>
            )}
          </Link>
        </div>

        <div className="flex-grow p-6 space-y-12 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 ml-4">TH</span>}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-[20px] text-[13px] font-black transition-all duration-500 group relative ${isCollapsed ? 'h-14 w-14 justify-center mx-auto' : 'px-6 py-4 gap-5'} ${isActive ? 'bg-cream-light text-primary shadow-sm' : 'text-neutral-400 hover:bg-neutral-50 hover:text-primary'}`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-accent-gold' : 'group-hover:text-primary transition-colors'} />
                    {!isCollapsed && <span className={`uppercase tracking-tight transition-colors duration-500 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>{item.name}</span>}
                    {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_10px_rgba(197,160,89,1)]"></div>}
                    
                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-luxury">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={`p-6 border-t border-neutral-50 bg-cream-light/10 space-y-4 ${isCollapsed ? 'items-center' : ''}`}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center gap-5 px-4 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50 hover:text-primary transition-all duration-500 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Menu size={18} strokeWidth={2} />
            {!isCollapsed && <span>Collapse</span>}
          </button>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-5 px-4 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-500 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} strokeWidth={2} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0 h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-neutral-100 flex items-center justify-between px-10 shrink-0">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-12 h-12 bg-neutral-50 hover:bg-neutral-100 text-primary rounded-2xl lg:hidden flex items-center justify-center transition-colors"
           >
             {isSidebarOpen ? <X size={20} strokeWidth={1} /> : <Menu size={20} strokeWidth={1} />}
           </button>
           
           <div className="flex items-center gap-8 ml-auto">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50 hover:text-primary transition-all duration-300 border border-neutral-100/50 hover:border-neutral-200"
              >
                <ExternalLink size={14} />
                <span className="hidden md:inline">View Store</span>
              </Link>
              <div className="text-right hidden sm:block space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none">The Director</p>
                <p className="text-[9px] font-bold text-accent-gold uppercase leading-none">Access Granted</p>
              </div>
              <div className="w-12 h-12 rounded-[20px] bg-primary text-white flex items-center justify-center font-black text-xs shadow-luxury border-2 border-cream-light relative group cursor-pointer">
                AD
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
           </div>
        </header>

        <main className="flex-grow overflow-y-auto p-10 md:p-16 custom-scrollbar bg-[#FBFBFB]">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
