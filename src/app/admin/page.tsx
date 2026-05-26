'use client';

import { Package, TicketPercent, TrendingUp, Users, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const stats = [
    { name: 'Portfolio Assets', value: '12', icon: Package, change: '+2 this month', color: 'bg-cream-light text-primary' },
    { name: 'Active Privileges', value: '5', icon: TicketPercent, change: 'Running stable', color: 'bg-white text-accent-gold shadow-sm' },
    { name: 'Daily Curations', value: '1,284', icon: Users, change: '+12.5%', color: 'bg-primary text-white shadow-luxury' },
    { name: 'Estimated Value', value: '฿124k', icon: TrendingUp, change: '+8.2%', color: 'bg-cream-light text-primary' },
  ];

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-accent-gold/40"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Executive Summary</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-0.04em] uppercase text-primary">Overview</h1>
        </div>
        <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl border border-neutral-100 shadow-luxury">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">System Online • May 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-10 rounded-[48px] border border-neutral-50 shadow-luxury hover:shadow-luxury-hover transition-all duration-700 group">
             <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${stat.color} transition-all duration-700 group-hover:scale-110 border border-neutral-100/50`}>
                  <stat.icon size={28} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-40">Dynamic</span>
                   <div className="flex items-center text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
                     {stat.change}
                   </div>
                </div>
             </div>
             <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tight text-primary">{stat.value}</h3>
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em]">{stat.name}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Recent Assets */}
        <div className="lg:col-span-8 bg-white rounded-[56px] border border-neutral-50 shadow-luxury overflow-hidden">
           <div className="p-10 border-b border-neutral-50 flex justify-between items-center bg-cream-light/20">
              <div className="space-y-1">
                 <h2 className="text-xl font-black uppercase tracking-tight">Recent Masterpieces</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">Latest additions to the atelier</p>
              </div>
              <Link href="/admin/products" className="w-12 h-12 bg-white rounded-2xl border border-neutral-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-sm">
                 <ArrowUpRight size={20} />
              </Link>
           </div>
           <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em] border-b border-neutral-50">
                      <th className="px-8 py-6">Asset Designation</th>
                      <th className="px-8 py-6">Classification</th>
                      <th className="px-8 py-6">Market Value</th>
                      <th className="px-8 py-6 text-right">Inventory</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {[
                      { name: 'The Table Plus', cat: 'Eat & Drink', price: '฿8,900', status: 'Available' },
                      { name: 'Tent Station', cat: 'Furniture', price: '฿5,900', status: 'Available' },
                      { name: 'Eraser Bin', cat: 'Hygiene', price: '฿3,900', status: 'Reserve' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-cream-light/30 transition-colors group">
                         <td className="px-8 py-8 font-black text-sm text-primary group-hover:text-accent-gold transition-colors uppercase tracking-tight">{item.name}</td>
                         <td className="px-8 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item.cat}</td>
                         <td className="px-8 py-8 font-black text-sm">{item.price}</td>
                         <td className="px-8 py-8 text-right">
                            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border ${item.status === 'Available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                              {item.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Quick Curation */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-primary text-white p-12 rounded-[56px] shadow-luxury relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-gold/20 transition-all duration-1000"></div>
              <div className="relative z-10 space-y-10">
                <div className="space-y-2">
                   <span className="text-accent-gold text-[10px] font-black uppercase tracking-[0.4em]">TH Control</span>
                   <h3 className="text-2xl font-black uppercase leading-tight tracking-tight">Quick <br /> Curation</h3>
                </div>
                <div className="space-y-4">
                   <Link href="/admin/products/new" className="flex items-center justify-between w-full bg-white text-black h-20 rounded-[24px] px-8 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-accent-gold hover:text-white transition-all duration-500 shadow-xl group/btn">
                      <span>Add Masterpiece</span>
                      <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                   </Link>
                   <button className="flex items-center justify-between w-full bg-white/5 border border-white/10 text-white h-20 rounded-[24px] px-8 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all duration-500">
                      <span>Issue Privilege</span>
                      <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
