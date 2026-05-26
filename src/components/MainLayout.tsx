'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import PageTransition from "@/components/PageTransition";
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

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
