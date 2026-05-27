import { createClient } from '@/lib/supabase/server'
import { Users, Search, MoreVertical } from 'lucide-react'

export default async function CustomersPage() {
  const supabase = await createClient()

  // Fetch profiles
  const { data: customers, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Customer Management</h1>
          <p className="text-neutral-500 font-medium">Manage your registered users and tiers.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-neutral-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-accent-gold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <th className="pb-4 pl-4">Customer</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Tier</th>
                <th className="pb-4">Duit Coins</th>
                <th className="pb-4">Joined</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {error || !customers || customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm font-medium text-neutral-400">
                    No customers found. Make sure you have run the setup_crm.sql script.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 pl-4 font-bold text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cream-light flex items-center justify-center text-accent-gold font-black text-xs">
                          {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {customer.full_name || 'Unknown User'}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-neutral-500">{customer.email}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        customer.tier === 'Platinum Elite' ? 'bg-primary text-white' : 
                        customer.tier === 'Gold' ? 'bg-accent-gold/10 text-accent-gold' : 
                        'bg-neutral-100 text-neutral-500'
                      }`}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="py-4 font-black text-accent-gold">{customer.duit_coins}</td>
                    <td className="py-4 text-sm text-neutral-400">{new Date(customer.created_at).toLocaleDateString()}</td>
                    <td className="py-4 text-right">
                      <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <MoreVertical size={16} className="text-neutral-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
