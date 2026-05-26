'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { upsertProduct } from '../../actions/product';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  Plus, 
  X, 
  Info, 
  Image as ImageIcon,
  Box,
  CheckCircle2,
  Loader2,
  Check,
  GripVertical
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'eat-drink',
    tagline: '',
    description: '',
    is_new: false,
    is_best: false,
    image_url: '',
    images: [] as string[],
    model_url: '',
    features: [] as string[],
    specs: [] as { label: string; value: string }[],
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
          
          if (data) {
            setFormData({
              ...data,
              price: data.price.toString(),
              features: data.features || [],
              specs: data.specs || [],
              images: data.images || (data.image_url ? [data.image_url] : []),
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, supabase]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImages = [...formData.images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        newImages.push(publicUrl);
      }

      setFormData({ 
        ...formData, 
        images: newImages,
        image_url: newImages[0] || '' // Set first as primary for compatibility
      });
      toast.success(`อัปโหลด ${files.length} รูปภาพสำเร็จ`);
    } catch (error: any) {
      toast.error('อัปโหลดรูปภาพไม่สำเร็จ: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ 
      ...formData, 
      images: newImages,
      image_url: newImages[0] || ''
    });
  };

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      toast.error('กรุณาอัปโหลดไฟล์นามสกุล .glb เท่านั้น');
      return;
    }

    setIsUploadingModel(true);
    try {
      const fileName = `${Math.random()}.glb`;
      const filePath = `product-models/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData({ ...formData, model_url: publicUrl });
      toast.success('อัปโหลดโมเดล 3D สำเร็จ');
    } catch (error: any) {
      toast.error('อัปโหลดโมเดลไม่สำเร็จ: ' + error.message);
    } finally {
      setIsUploadingModel(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      if (isEdit) data.append('id', id as string);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features' || key === 'specs' || key === 'images') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value.toString());
        }
      });

      await upsertProduct(data);
      toast.success(isEdit ? 'แก้ไขสินค้าเรียบร้อยแล้ว' : 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const addSpec = () => {
    setFormData({ ...formData, specs: [...formData.specs, { label: '', value: '' }] });
  };

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const removeSpec = (index: number) => {
    setFormData({ ...formData, specs: formData.specs.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            href="/admin/products"
            className="w-14 h-14 rounded-3xl bg-white border border-neutral-100 flex items-center justify-center text-secondary hover:text-primary transition-all shadow-sm hover:shadow-luxury group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-8 bg-accent-gold/40"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Curating Portfolio</span>
            </div>
            <h1 className="text-5xl font-black tracking-[-0.04em] uppercase text-primary">
              {isEdit ? 'Refine Asset' : 'New Masterpiece'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Main Form */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-white p-12 md:p-16 rounded-[64px] border border-neutral-50 shadow-luxury space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cream-light/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4 relative z-10">
               <Info size={22} className="text-accent-gold" /> Identity & Essence
            </h2>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-6">Designation (Product Name)</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-20 bg-cream-light/30 border border-neutral-100 rounded-[28px] px-10 text-lg font-black uppercase tracking-tight focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none shadow-sm"
                  placeholder="The Table Plus"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-6">Market Value (THB)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-20 bg-cream-light/30 border border-neutral-100 rounded-[28px] px-10 text-lg font-black tracking-tighter focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none shadow-sm"
                    placeholder="8900"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-6">Classification</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-20 bg-cream-light/30 border border-neutral-100 rounded-[28px] px-10 text-sm font-black uppercase tracking-widest focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="eat-drink">Eat & Drink</option>
                    <option value="furniture">Furniture</option>
                    <option value="play-rest">Play & Rest</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="daily">Daily Essentials</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-6">The Tagline (Signature Statement)</label>
                <input 
                  type="text" 
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full h-20 bg-cream-light/30 border border-neutral-100 rounded-[28px] px-10 text-base font-bold italic tracking-wide focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none shadow-sm"
                  placeholder="Redefining the Pet Living Standard"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-6">Narrative Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-56 bg-cream-light/30 border border-neutral-100 rounded-[40px] p-10 text-base font-medium leading-relaxed focus:ring-4 ring-accent-gold/5 focus:border-accent-gold transition-all outline-none resize-none shadow-sm"
                  placeholder="Detail the craftsmanship and vision behind this piece..."
                  required
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-12 md:p-16 rounded-[64px] border border-neutral-50 shadow-luxury space-y-12">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
               <CheckCircle2 size={22} className="text-accent-gold" /> Craftsmanship & Technicality
            </h2>
            
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">Distinguished Features</label>
                  <button type="button" onClick={addFeature} className="text-[10px] font-black text-accent-gold uppercase tracking-[0.2em] flex items-center gap-3 hover:underline">
                    <Plus size={16} strokeWidth={3} /> Add Feature
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.features.map((feature, i) => (
                    <div key={i} className="flex gap-6 group">
                       <div className="w-16 h-16 rounded-2xl bg-cream-light border border-neutral-100 flex items-center justify-center text-[10px] font-black text-primary flex-shrink-0 shadow-sm">0{i+1}</div>
                       <input 
                         value={feature}
                         onChange={(e) => updateFeature(i, e.target.value)}
                         className="flex-grow h-16 bg-cream-light/20 border border-neutral-100 rounded-2xl px-8 text-sm font-bold outline-none focus:border-accent-gold transition-all shadow-sm"
                         placeholder={`Defining Feature #${i+1}`}
                       />
                       <button type="button" onClick={() => removeFeature(i)} className="w-16 h-16 rounded-2xl bg-red-50 text-red-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500">
                         <X size={20} strokeWidth={1} />
                       </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">Material & Dimensions</label>
                  <button type="button" onClick={addSpec} className="text-[10px] font-black text-accent-gold uppercase tracking-[0.2em] flex items-center gap-3 hover:underline">
                    <Plus size={16} strokeWidth={3} /> Add Spec
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.specs.map((spec, i) => (
                    <div key={i} className="flex gap-6 group">
                       <input 
                         value={spec.label}
                         onChange={(e) => updateSpec(i, 'label', e.target.value)}
                         className="w-1/3 h-16 bg-cream-light/20 border border-neutral-100 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent-gold transition-all shadow-sm"
                         placeholder="Attribute"
                       />
                       <input 
                         value={spec.value}
                         onChange={(e) => updateSpec(i, 'value', e.target.value)}
                         className="flex-grow h-16 bg-cream-light/20 border border-neutral-100 rounded-2xl px-8 text-sm font-bold outline-none focus:border-accent-gold transition-all shadow-sm"
                         placeholder="Value (e.g. Brushed Steel)"
                       />
                       <button type="button" onClick={() => removeSpec(i)} className="w-16 h-16 rounded-2xl bg-red-50 text-red-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500">
                         <X size={20} strokeWidth={1} />
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Media & Publish */}
        <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
           <section className="bg-white p-10 rounded-[56px] border border-neutral-50 shadow-luxury space-y-10 relative overflow-hidden">
              <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-4">
                 <ImageIcon size={22} className="text-accent-gold" /> The Visuals
              </h2>
              
              <div className="space-y-8">
                <div className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">Image Gallery</label>
                      <label className="cursor-pointer text-[10px] font-black text-accent-gold uppercase tracking-[0.2em] flex items-center gap-2 hover:underline">
                         <Plus size={14} strokeWidth={3} /> Add Photos
                         <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                      </label>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      {formData.images.map((url, i) => (
                        <div key={i} className="aspect-square bg-cream-light rounded-3xl border border-neutral-100 relative overflow-hidden group">
                           <Image src={url} alt={`Gallery ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <button type="button" onClick={() => removeImage(i)} className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:scale-110 transition-transform">
                                 <X size={18} />
                              </button>
                           </div>
                           {i === 0 && (
                             <div className="absolute top-3 left-3 bg-accent-gold text-white text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-lg">Primary</div>
                           )}
                        </div>
                      ))}
                      {isUploading && (
                        <div className="aspect-square bg-white border-2 border-dashed border-neutral-100 rounded-3xl flex flex-col items-center justify-center gap-3 animate-pulse">
                           <Loader2 className="animate-spin text-accent-gold" size={20} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Uploading...</span>
                        </div>
                      )}
                      {formData.images.length === 0 && !isUploading && (
                        <div className="col-span-2 aspect-video bg-cream-light rounded-[40px] border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center gap-4 opacity-40">
                           <ImageIcon size={32} strokeWidth={0.5} />
                           <p className="text-[9px] font-black uppercase tracking-[0.2em]">No imagery selected</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 ml-4">3D Asset (.glb)</label>
                  <div className="flex gap-4">
                    <div className="relative flex-grow">
                      <Box className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-200" size={20} strokeWidth={1} />
                      <input 
                        type="text" 
                        value={formData.model_url}
                        onChange={(e) => setFormData({ ...formData, model_url: e.target.value })}
                        className="w-full h-16 bg-cream-light/30 border border-neutral-100 rounded-2xl pl-16 pr-8 text-xs font-bold outline-none focus:border-accent-gold transition-all shadow-sm"
                        placeholder="Link or Upload ->"
                      />
                    </div>
                    <label className="w-16 h-16 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center cursor-pointer hover:border-accent-gold hover:text-accent-gold transition-all shadow-sm active:scale-95">
                       {isUploadingModel ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                       <input type="file" onChange={handleModelUpload} className="hidden" accept=".glb" />
                    </label>
                  </div>
                  {formData.model_url && (
                    <div className="text-[9px] font-bold text-green-600 uppercase tracking-widest ml-4 flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div> Asset Connected
                    </div>
                  )}
                </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-[56px] border border-neutral-50 shadow-luxury space-y-8">
              <h2 className="text-lg font-black uppercase tracking-tight">Status</h2>
              <div className="space-y-4">
                 <label className="flex items-center gap-6 p-6 rounded-3xl bg-cream-light/30 border border-neutral-100 cursor-pointer hover:bg-cream-light hover:border-accent-gold/30 transition-all group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_new ? 'bg-primary border-primary' : 'bg-white border-neutral-100 group-hover:border-neutral-200'}`}>
                       {formData.is_new && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      className="hidden" 
                    />
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">New Arrival Collection</span>
                 </label>
                 <label className="flex items-center gap-6 p-6 rounded-3xl bg-cream-light/30 border border-neutral-100 cursor-pointer hover:bg-cream-light hover:border-accent-gold/30 transition-all group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_best ? 'bg-accent-gold border-accent-gold shadow-lg shadow-accent-gold/20' : 'bg-white border-neutral-100 group-hover:border-neutral-200'}`}>
                       {formData.is_best && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.is_best}
                      onChange={(e) => setFormData({ ...formData, is_best: e.target.checked })}
                      className="hidden" 
                    />
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Essential Signature</span>
                 </label>
              </div>
           </section>

           <button 
             type="submit"
             disabled={isLoading || isUploading || isUploadingModel}
             className="group relative w-full bg-primary text-white h-24 rounded-full overflow-hidden transition-all shadow-luxury active:scale-95 duration-500 disabled:opacity-50"
           >
             <div className="absolute inset-0 bg-accent-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <div className="relative z-10 flex items-center justify-center gap-6 font-black uppercase tracking-[0.3em] text-xs">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} strokeWidth={1.5} />}
                <span>{isEdit ? 'Refine Portfolio' : 'Publish Asset'}</span>
             </div>
           </button>
        </div>
      </form>
    </div>
  );
}
