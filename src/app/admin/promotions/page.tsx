'use client';

import { 
  TicketPercent, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminPromotionsPage() {
  const [filter, setFilter] = useState('all');

  const stats = [
    { name: 'Active Privileges', value: '8', icon: TicketPercent, color: 'bg-primary text-white' },
    { name: 'Total Redemptions', value: '1,420', icon: Users, color: 'bg-white text-primary border border-neutral-100' },
    { name: 'Avg. Conversion', value: '24.5%', icon: Zap, color: 'bg-accent-gold text-white' },
  ];

  const promotions = [
    { 
      id: 'PRM-001', 
      name: 'Executive Summer Privilege', 
      type: 'Discount', 
      value: '20% OFF', 
      usage: '425/500', 
      status: 'Active',
      expiry: 'June 30, 2026',
      performance: '+12%'
    },
    { 
      id: 'PRM-002', 
      name: 'Atelier First Purchase', 
      type: 'Welcome', 
      value: '฿500 Credit', 
      usage: '890/∞', 
      status: 'Active',
      expiry: 'Ongoing',
      performance: '+5%'
    },
    { 
      id: 'PRM-003', 
      name: 'Exclusive Member Night', 
      type: 'Event', 
      value: 'Invited Only', 
      usage: '48/50', 
      status: 'Expiring Soon',
      expiry: 'In 2 days',
      performance: 'High'
    },
    { 
      id: 'PRM-004', 
      name: 'Heritage Collection Launch', 
      type: 'Limited', 
      value: 'Buy 2 Get 1', 
      usage: '0/100', 
      status: 'Scheduled',
      expiry: 'Starts July 1',
      performance: 'New'
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-accent-gold/40"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Campaign Management</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-0.04em] uppercase text-primary">Privileges</h1>
        </div>
        <button className="flex items-center gap-4 bg-primary text-white px-8 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-luxury hover:bg-accent-gold transition-all duration-500 active:scale-95 group">
           <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
           <span>Create Privilege</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name} 
            className="bg-white p-10 rounded-[48px] border border-neutral-50 shadow-luxury flex items-center gap-8 group hover:border-accent-gold/20 transition-all duration-500"
          >
             <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 ${stat.color} shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                <stat.icon size={32} strokeWidth={1.5} />
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-3xl font-black text-primary">{stat.value}</h3>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[56px] border border-neutral-50 shadow-luxury overflow-hidden">
        {/* Table Filters */}
        <div className="p-10 border-b border-neutral-50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-cream-light/10">
           <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              {['All Status', 'Active', 'Scheduled', 'Expired'].map((s) => (
                <button 
                  key={s}
                  onClick={() => setFilter(s.toLowerCase())}
                  className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filter === s.toLowerCase() ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-400 border border-neutral-100 hover:border-primary/20'}`}
                >
                  {s}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-4">
              <div className="relative flex-grow lg:flex-grow-0">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search Privilege..."
                   className="w-full lg:w-72 bg-white border border-neutral-100 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-bold outline-none focus:border-accent-gold transition-colors"
                 />
              </div>
              <button className="w-14 h-14 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center text-primary hover:bg-neutral-50 transition-colors">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em] border-b border-neutral-50 bg-neutral-50/30">
                  <th className="px-10 py-8">Privilege Details</th>
                  <th className="px-10 py-8 text-center">Benefit</th>
                  <th className="px-10 py-8 text-center">Usage</th>
                  <th className="px-10 py-8 text-center">Status</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {promotions.map((promo, i) => (
                  <tr key={i} className="group hover:bg-cream-light/20 transition-colors">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                            <TicketPercent size={24} strokeWidth={1.5} />
                         </div>
                         <div className="space-y-1">
                            <p className="font-black text-primary text-sm uppercase tracking-tight group-hover:text-accent-gold transition-colors">{promo.name}</p>
                            <div className="flex items-center gap-3">
                               <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest">{promo.id}</span>
                               <span className="w-1 h-1 rounded-full bg-neutral-200"></span>
                               <span className="text-[9px] font-black text-accent-gold uppercase tracking-widest">{promo.type}</span>
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-center font-black text-sm text-primary">
                       {promo.value}
                    </td>
                    <td className="px-10 py-10 text-center">
                       <div className="space-y-2 max-w-[120px] mx-auto">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                             <span>Redeemed</span>
                             <span className="text-primary">{promo.usage.split('/')[0]}</span>
                          </div>
                          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-accent-gold rounded-full transition-all duration-1000" 
                               style={{ width: promo.usage.includes('∞') ? '40%' : `${(parseInt(promo.usage.split('/')[0])/parseInt(promo.usage.split('/')[1]))*100}%` }}
                             ></div>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-10 text-center">
                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         promo.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                         promo.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                         'bg-neutral-50 text-neutral-400 border-neutral-100'
                       }`}>
                          {promo.status === 'Active' && <CheckCircle2 size={12} />}
                          {promo.status === 'Expiring Soon' && <Clock size={12} />}
                          {promo.status === 'Scheduled' && <Calendar size={12} />}
                          {promo.status}
                       </span>
                    </td>
                    <td className="px-10 py-10 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button className="w-10 h-10 bg-white border border-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                             <MoreHorizontal size={18} />
                          </button>
                          <button className="w-10 h-10 bg-white border border-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-accent-gold hover:text-white hover:border-accent-gold transition-all duration-300">
                             <ArrowUpRight size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>

        {/* Footer Info */}
        <div className="p-10 bg-neutral-50/50 border-t border-neutral-50 flex items-center gap-4">
           <AlertCircle size={16} className="text-neutral-300" />
           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Only authorized Atelier directors can modify global privilege parameters.</p>
        </div>
      </div>
    </div>
  );
}
