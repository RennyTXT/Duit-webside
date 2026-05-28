import { Truck, ShieldCheck, Clock, MapPin, Package, RefreshCcw } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center py-24 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] tracking-ultra rounded-full uppercase">Logistics</span>
          <h1 className="text-5xl md:text-7xl tracking-tighter uppercase leading-tight">Shipping Policy</h1>
          <p className="max-w-2xl mx-auto text-lg text-secondary font-medium leading-relaxed">
            เรามุ่งมั่นที่จะส่งมอบนวัตกรรมความสุขให้ถึงหน้าบ้านคุณอย่างรวดเร็วและปลอดภัยที่สุด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
           {[
             { title: 'ส่งฟรีทั่วไทย', desc: 'ไม่มีขั้นต่ำสำหรับการสั่งซื้อทุกรายการผ่านช่องทางออนไลน์', icon: Truck },
             { title: 'ความรวดเร็ว', desc: 'กทม. 1-2 วันทำการ / ต่างจังหวัด 2-4 วันทำการ', icon: Clock },
             { title: 'ปลอดภัย', desc: 'แพ็กสินค้าด้วยวัสดุกันกระแทกคุณภาพสูงทุกชิ้น', icon: ShieldCheck },
             { title: 'ตรวจสอบได้', desc: 'รับหมายเลขติดตามพัสดุ (Tracking Number) ทันทีที่จัดส่ง', icon: MapPin },
           ].map((item, i) => (
             <div key={i} className="flex gap-6 p-8 rounded-[32px] bg-neutral-50 border border-neutral-100 group hover:border-accent/20 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                   <item.icon size={24} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-lg text-primary uppercase">{item.title}</h3>
                   <p className="text-sm text-secondary leading-relaxed font-medium">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="prose prose-neutral max-w-none space-y-16">
           <section className="space-y-6">
              <h2 className="text-2xl uppercase flex items-center gap-3">
                 <Package className="text-accent" size={24} /> ขั้นตอนการจัดส่ง
              </h2>
              <div className="space-y-4 text-secondary font-medium leading-relaxed">
                 <p>1. เมื่อได้รับคำสั่งซื้อและยืนยันการชำระเงิน ทีมงานจะดำเนินการเตรียมสินค้าภายใน 24 ชม.</p>
                 <p>2. สินค้าจะได้รับการตรวจสอบคุณภาพ (Quality Check) ก่อนบรรจุลงกล่อง</p>
                 <p>3. ขนส่งพันธมิตรของเรา (SCG Express / Flash Express) จะเข้ารับสินค้าเพื่อกระจายไปยังปลายทาง</p>
                 <p>4. ลูกค้าจะได้รับ SMS หรือ Email แจ้งสถานะการจัดส่งพร้อมลิงก์ติดตามพัสดุ</p>
              </div>
           </section>

           <section className="space-y-6 pt-16 border-t border-neutral-100">
              <h2 className="text-2xl uppercase flex items-center gap-3">
                 <RefreshCcw className="text-accent" size={24} /> การเปลี่ยนหรือคืนสินค้า
              </h2>
              <div className="space-y-4 text-secondary font-medium leading-relaxed">
                 <p>หากสินค้าที่ได้รับมีความเสียหายจากการขนส่ง หรือไม่ถูกต้องตามรายการที่สั่งซื้อ คุณสามารถติดต่อเราเพื่อดำเนินการเปลี่ยนสินค้าใหม่ได้ภายใน 7 วัน นับจากวันที่ได้รับสินค้า</p>
                 <p className="bg-neutral-50 p-6 rounded-2xl italic border-l-4 border-accent">
                    "กรุณาถ่ายวิดีโอขณะเปิดกล่องพัสดุเพื่อเป็นหลักฐานในการเคลมสินค้า"
                 </p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
