import { Shield, Eye, Lock, Globe } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="py-24 space-y-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Privacy Policy</h1>
          <p className="text-sm font-black text-neutral-400 uppercase tracking-ultra">Last Updated: May 2026</p>
        </div>

        <div className="space-y-16 text-secondary font-medium leading-relaxed">
           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase">1. ข้อมูลที่เราจัดเก็บ</h2>
              <p>เราจัดเก็บข้อมูลที่จำเป็นเพื่อมอบบริการที่ดีที่สุดแก่คุณและสัตว์เลี้ยงของคุณ รวมถึง:</p>
              <ul className="list-disc pl-6 space-y-3">
                 <li>ข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทรศัพท์, ที่อยู่จัดส่ง)</li>
                 <li>โปรไฟล์สัตว์เลี้ยง (ชื่อ, ประเภท, สายพันธุ์, ขนาด)</li>
                 <li>ประวัติการสั่งซื้อและข้อมูลการชำระเงิน</li>
              </ul>
           </section>

           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase">2. การใช้ข้อมูล</h2>
              <p>ข้อมูลของคุณจะถูกใช้เพื่อ:</p>
              <ul className="list-disc pl-6 space-y-3">
                 <li>ประมวลผลคำสั่งซื้อและจัดส่งสินค้า</li>
                 <li>มอบคำแนะนำผลิตภัณฑ์ที่เหมาะสมผ่าน Duit Care+</li>
                 <li>ปรับปรุงบริการและพัฒนาผลิตภัณฑ์ใหม่</li>
                 <li>สื่อสารข่าวสารและโปรโมชัน (ที่คุณสามารถยกเลิกได้ตลอดเวลา)</li>
              </ul>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-neutral-100 my-16">
              {[
                { label: 'Security', icon: Lock, desc: 'เข้ารหัสข้อมูลระดับสูง' },
                { label: 'Transparency', icon: Eye, desc: 'โปร่งใสในทุกขั้นตอน' },
                { label: 'Global Standard', icon: Globe, desc: 'มาตรฐานสากล' },
              ].map((item, i) => (
                <div key={i} className="text-center space-y-4">
                   <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto text-accent">
                      <item.icon size={20} />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-primary">{item.label}</h4>
                   <p className="text-[10px] text-neutral-400 font-bold uppercase">{item.desc}</p>
                </div>
              ))}
           </div>

           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase">3. การคุ้มครองข้อมูล</h2>
              <p>เราให้ความสำคัญสูงสุดกับความปลอดภัยของข้อมูลคุณ เราใช้เทคโนโลยีการเข้ารหัส SSL และมาตรการรักษาความปลอดภัยที่เข้มงวดเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต</p>
           </section>

           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase">4. ติดต่อเรา</h2>
              <p>หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ของเราได้ที่ privacy@duit.co.th</p>
           </section>
        </div>
      </div>
    </div>
  );
}
