'use client';

import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../actions/product';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search, Filter, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error: any) {
      toast.error('ไม่สามารถโหลดข้อมูลสินค้าได้: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ยืนยันการลบสินค้า "${name}"?`)) return;

    try {
      await deleteProduct(id);
      toast.success('ลบสินค้าเรียบร้อยแล้ว');
      loadProducts();
    } catch (error: any) {
      toast.error('ลบสินค้าไม่สำเร็จ: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-8 bg-accent-gold/40"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Inventory Control</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-0.04em] uppercase text-primary text-luxury-gradient">Masterpieces</h1>
        </div>
        <Link 
          href="/admin/products/new"
          className="group relative bg-primary text-white px-12 py-5 rounded-full overflow-hidden transition-all shadow-luxury flex items-center gap-4 active:scale-95 duration-500"
        >
          <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <Plus size={18} className="relative z-10" />
          <span className="relative z-10 font-black uppercase tracking-[0.2em] text-[10px]">Add New Asset</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 md:p-8 rounded-[40px] border border-neutral-50 shadow-luxury flex flex-col md:flex-row gap-8 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-neutral-300" size={18} strokeWidth={1.5} />
          <input 
            type="text"
            placeholder="Search by designation or classification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-16 bg-cream-light/30 border border-neutral-100 rounded-full pl-20 pr-10 text-sm font-bold focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none uppercase tracking-tight"
          />
        </div>
        <button className="h-16 px-12 bg-white border border-neutral-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-primary hover:border-primary transition-all flex items-center gap-4 shadow-sm group">
          <Filter size={14} className="group-hover:text-accent-gold transition-colors" /> 
          <span>Refine</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[56px] border border-neutral-50 shadow-luxury overflow-hidden">
        {isLoading ? (
          <div className="py-60 flex flex-col items-center justify-center gap-8 text-neutral-200">
            <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Portfolio...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-60 text-center space-y-8 opacity-40">
             <div className="w-32 h-32 bg-cream-light rounded-[48px] flex items-center justify-center mx-auto border border-neutral-100">
               <Package size={64} />
             </div>
             <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">No assets match your query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.3em] border-b border-neutral-50 bg-cream-light/10">
                  <th className="px-12 py-10">Visual</th>
                  <th className="px-12 py-10">Asset Designation</th>
                  <th className="px-12 py-10">Classification</th>
                  <th className="px-12 py-10">Market Value</th>
                  <th className="px-12 py-10">Status</th>
                  <th className="px-12 py-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-light/20 transition-all duration-500 group">
                    <td className="px-12 py-10">
                      <div className="w-20 h-24 bg-white rounded-3xl relative overflow-hidden border border-neutral-100 shadow-sm group-hover:shadow-xl transition-all duration-700 p-1">
                        {product.image_url ? (
                          <Image 
                            src={product.image_url} 
                            alt={product.name} 
                            fill 
                            className="object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-200">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="space-y-2">
                        <h3 className="text-base font-black text-primary group-hover:text-accent-gold transition-colors uppercase leading-none tracking-tight">{product.name}</h3>
                        <p className="text-[10px] text-secondary font-medium line-clamp-1 italic tracking-wide opacity-50">{product.tagline}</p>
                        <div className="flex gap-2 pt-2">
                          {product.is_new && <span className="text-[7px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-[0.2em] border border-white/10">New Arrival</span>}
                          {product.is_best && <span className="text-[7px] font-black bg-accent-gold/10 text-accent-gold px-2 py-0.5 rounded-full uppercase tracking-[0.2em] border border-accent-gold/20">Essential</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className="text-[10px] font-black text-secondary uppercase bg-white px-4 py-2 rounded-xl border border-neutral-100 shadow-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-12 py-10">
                      <span className="text-sm font-black text-primary tracking-tighter">฿{product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-12 py-10">
                      <span className="flex items-center gap-3 text-[9px] font-black text-green-600 uppercase tracking-[0.2em]">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse"></div> Active
                      </span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                        <Link 
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-primary hover:border-primary transition-all shadow-sm active:scale-90"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-accent-gold hover:border-accent-gold transition-all shadow-sm active:scale-90"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white flex items-center justify-center text-neutral-300 hover:text-red-500 hover:border-red-500 transition-all shadow-sm active:scale-90"
                        >
                          <Trash2 size={16} />
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

function Package({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
