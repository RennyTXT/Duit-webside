'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import PageTransition from "@/components/PageTransition";
import { ReactNode, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePetStore } from '@/store/usePetStore';

interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { clearProfile } = usePetStore();

  useEffect(() => {
    const supabase = createClient();

    // 1. Check initial session
    const syncAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        clearProfile();
      }
    };
    syncAuth();

    // 2. Listen for auth changes globally
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        clearProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearProfile]);


  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-grow">
        {isAdmin ? children : (
          <PageTransition>
            {children}
          </PageTransition>
        )}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
