import { createClient } from '@/lib/supabase/server'
import { Heart, Search, Plus, MoreVertical } from 'lucide-react'

export default async function AdoptionsPage() {
  const supabase = await createClient()

  // Fetch adoptions
  const { data: adoptions, error } = await supabase
    .from('adoptions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl uppercase tracking-tighter">Adoption Spotlight</h1>
          <p className="text-sm sm:text-base text-neutral-500 font-medium mt-1">Manage pets looking for their forever homes.</p>
        </div>
        <button className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent-gold transition-colors shadow-luxury">
          <Plus size={16} /> New Listing
        </button>
      </div>

      <div className="bg-white rounded-[24px] sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="w-full bg-neutral-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-accent-gold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-[10px] uppercase tracking-widest text-neutral-400">
                <th className="pb-4 pl-4">Pet Name</th>
                <th className="pb-4">Type/Breed</th>
                <th className="pb-4">Age/Gender</th>
                <th className="pb-4">Shelter</th>
                <th className="pb-4">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {error || !adoptions || adoptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm font-medium text-neutral-400">
                    No adoption listings found. Click "New Listing" to add one.
                  </td>
                </tr>
              ) : (
                adoptions.map((pet) => (
                  <tr key={pet.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 pl-4 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cream-light overflow-hidden relative">
                           {/* Assuming image_url exists, else placeholder */}
                           <div className="w-full h-full flex items-center justify-center text-accent-gold"><Heart size={16} /></div>
                        </div>
                        {pet.name}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-neutral-500 capitalize">{pet.type} • {pet.breed || 'Mixed'}</td>
                    <td className="py-4 text-sm text-neutral-500 capitalize">{pet.age} • {pet.gender}</td>
                    <td className="py-4 text-sm font-medium text-primary">{pet.shelter_name}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px]  uppercase tracking-widest ${
                        pet.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {pet.status}
                      </span>
                    </td>
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
