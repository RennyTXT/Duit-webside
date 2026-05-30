'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Search, MoreVertical, ShieldCheck, Mail, Calendar, Coins, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCustomers = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      toast.error('Failed to load customers: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    (c.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-accent-gold/40"></div>
             <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">Member Directory</span>
          </div>
          <h1 className="text-5xl tracking-[-0.04em] uppercase text-primary">Customers</h1>
        </div>
        <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl border border-neutral-100 shadow-luxury">
           <Users className="text-accent-gold" size={20} />
           <span className="text-[11px] uppercase tracking-[0.2em] text-secondary">{customers.length} Registered Members</span>
        </div>
      </div>

      {/* Refined Minimal Toolbar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-grow w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-accent-gold transition-colors" size={18} strokeWidth={1.5} />
          <input 
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 bg-white border border-neutral-100 rounded-2xl pl-16 pr-6 text-sm focus:border-accent-gold transition-all outline-none uppercase tracking-widest placeholder:text-neutral-200"
          />
        </div>
        <button className="h-14 px-8 bg-white border border-neutral-100 rounded-2xl text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-primary hover:border-primary transition-all flex items-center gap-3 shrink-0 active:scale-95">
          <Filter size={14} strokeWidth={1.5} /> 
          <span>Refine</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[56px] border border-neutral-50 shadow-luxury overflow-hidden">
        {isLoading ? (
          <div className="py-60 flex flex-col items-center justify-center gap-8 text-neutral-200">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-[10px] uppercase tracking-[0.4em]">Accessing Directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-60 text-center space-y-8 opacity-40">
             <div className="w-32 h-32 bg-cream-light rounded-[48px] flex items-center justify-center mx-auto border border-neutral-100">
               <Users size={64} />
             </div>
             <p className="text-primary uppercase tracking-[0.2em] text-[10px]">No members found in the atelier</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-neutral-300 uppercase tracking-[0.3em] border-b border-neutral-50 bg-cream-light/10">
                  <th className="px-12 py-10">Client Persona</th>
                  <th className="px-12 py-10">Access Identifier</th>
                  <th className="px-12 py-10 text-center">Elite Tier</th>
                  <th className="px-12 py-10 text-center">Atelier Credit</th>
                  <th className="px-12 py-10">Date Registered</th>
                  <th className="px-12 py-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-cream-light/20 transition-all duration-500 group">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[20px] bg-primary text-white flex items-center justify-center text-sm font-medium shadow-lg border-2 border-cream-light shrink-0">
                          {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm text-primary group-hover:text-accent-gold transition-colors uppercase font-bold tracking-tight">{customer.full_name || 'Anonymous Client'}</h3>
                          <div className="flex items-center gap-2 opacity-50">
                             <Mail size={12} />
                             <span className="text-[10px] lowercase tracking-wide">{customer.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100">
                        {customer.username || 'NO_ID'}
                      </span>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] uppercase tracking-widest border transition-all duration-500 ${
                        customer.tier === 'Platinum Elite' ? 'bg-primary text-white border-primary shadow-lg' : 
                        customer.tier === 'Gold' ? 'bg-accent-gold text-white border-accent-gold' : 
                        'bg-white text-neutral-400 border-neutral-100'
                      }`}>
                        <ShieldCheck size={12} />
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-12 py-10 text-center">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-sm text-primary font-medium tracking-tight">฿{customer.duit_coins.toLocaleString()}</span>
                          <span className="text-[7px] uppercase tracking-widest text-accent-gold font-bold">Duit Coins</span>
                       </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-3 text-neutral-400">
                         <Calendar size={14} strokeWidth={1.5} />
                         <span className="text-[10px] uppercase tracking-widest">{new Date(customer.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                        <button className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-primary hover:border-primary transition-all shadow-sm active:scale-90">
                          <MoreVertical size={16} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-accent-gold hover:border-accent-gold transition-all shadow-sm active:scale-90">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
