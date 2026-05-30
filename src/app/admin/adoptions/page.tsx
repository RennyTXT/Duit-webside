'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart, Search, Plus, MoreVertical, PawPrint, MapPin, CheckCircle2, Filter, Loader2, ExternalLink, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminAdoptionsPage() {
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  const loadAdoptions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('adoptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdoptions(data || []);
    } catch (error: any) {
      toast.error('Failed to load adoptions: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdoptions();
  }, []);

  const filteredAdoptions = adoptions.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.shelter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-accent-gold/40"></div>
             <span className="text-[10px] uppercase tracking-[0.4em] text-accent-gold">Social Responsibility</span>
          </div>
          <h1 className="text-5xl tracking-[-0.04em] uppercase text-primary">Adoption Spotlight</h1>
        </div>
        <button className="group relative bg-primary text-white px-12 py-5 rounded-full overflow-hidden transition-all shadow-luxury flex items-center gap-4 active:scale-95 duration-500">
           <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
           <Plus size={18} className="relative z-10" />
           <span className="relative z-10 uppercase tracking-[0.2em] text-[10px]">New Listing</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 md:p-8 rounded-[40px] border border-neutral-50 shadow-luxury flex flex-col md:flex-row gap-8 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-neutral-300" size={18} strokeWidth={1.5} />
          <input 
            type="text"
            placeholder="Search by pet name, breed, or shelter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-16 bg-cream-light/30 border border-neutral-100 rounded-full pl-20 pr-10 text-sm focus:ring-4 ring-accent-gold/5 focus:border-accent-gold outline-none transition-all uppercase tracking-tight"
          />
        </div>
        <button className="h-16 px-12 bg-white border border-neutral-100 rounded-full text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-primary hover:border-primary transition-all flex items-center gap-4 shadow-sm group">
          <Filter size={14} className="group-hover:text-accent-gold transition-colors" /> 
          <span>Refine</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[56px] border border-neutral-50 shadow-luxury overflow-hidden">
        {isLoading ? (
          <div className="py-60 flex flex-col items-center justify-center gap-8 text-neutral-200">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="text-[10px] uppercase tracking-[0.4em]">Curating Spotlights...</p>
          </div>
        ) : filteredAdoptions.length === 0 ? (
          <div className="py-60 text-center space-y-8 opacity-40">
             <div className="w-32 h-32 bg-cream-light rounded-[48px] flex items-center justify-center mx-auto border border-neutral-100">
               <Heart size={64} />
             </div>
             <p className="text-primary uppercase tracking-[0.2em] text-[10px]">No listings currently active</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-neutral-300 uppercase tracking-[0.3em] border-b border-neutral-50 bg-cream-light/10">
                  <th className="px-12 py-10">Pet Persona</th>
                  <th className="px-12 py-10">Heritage & Class</th>
                  <th className="px-12 py-10">Vital Statistics</th>
                  <th className="px-12 py-10">Origin / Shelter</th>
                  <th className="px-12 py-10">Curation Status</th>
                  <th className="px-12 py-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredAdoptions.map((pet) => (
                  <tr key={pet.id} className="hover:bg-cream-light/20 transition-all duration-500 group">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-20 bg-neutral-100 rounded-2xl relative overflow-hidden shadow-sm border border-white">
                          {pet.image_url ? (
                            <Image src={pet.image_url} alt={pet.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <Camera size={20} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm text-primary group-hover:text-accent-gold transition-colors uppercase font-bold tracking-tight">{pet.name}</h3>
                          <div className="flex items-center gap-2 opacity-50">
                             <PawPrint size={12} />
                             <span className="text-[10px] uppercase tracking-widest">{pet.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className="text-[10px] text-secondary uppercase bg-white px-4 py-2 rounded-xl border border-neutral-100 shadow-sm inline-block">
                        {pet.breed || 'Unique Heritage'}
                      </span>
                    </td>
                    <td className="px-12 py-10">
                       <div className="space-y-1">
                          <p className="text-[10px] text-primary uppercase font-medium">{pet.age || 'Unknown Age'}</p>
                          <p className="text-[9px] text-neutral-400 uppercase tracking-widest">{pet.gender || 'Not Specified'}</p>
                       </div>
                    </td>
                    <td className="px-12 py-10">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cream-light rounded-full flex items-center justify-center text-accent-gold shadow-sm">
                             <MapPin size={14} />
                          </div>
                          <span className="text-[10px] text-primary uppercase font-bold tracking-tight">{pet.shelter_name}</span>
                       </div>
                    </td>
                    <td className="px-12 py-10">
                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] uppercase tracking-widest border ${
                         pet.status === 'available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'
                       }`}>
                          {pet.status === 'available' && <CheckCircle2 size={12} />}
                          {pet.status}
                       </span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                        <Link href="/duit-care" target="_blank" className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-primary hover:border-primary transition-all shadow-sm active:scale-90">
                           <ExternalLink size={16} />
                        </Link>
                        <button className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-accent-gold hover:border-accent-gold transition-all shadow-sm active:scale-90">
                          <MoreVertical size={16} />
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
