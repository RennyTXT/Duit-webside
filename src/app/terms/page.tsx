import { Scale, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="py-24 space-y-8">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center">
            <Scale size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Terms of Service</h1>
          <p className="text-sm font-black text-neutral-400 uppercase tracking-ultra">Effective Date: May 2026</p>
        </div>

        <div className="space-y-16 text-secondary font-medium leading-relaxed">
           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase flex items-center gap-3">
                 <FileText size={20} className="text-accent" /> 1. การยอมรับเงื่อนไข
              </h2>
              <p>การเข้าถึงและใช้งานเว็บไซต์ Duit Thailand ถือว่าคุณได้ยอมรับข้อกำหนดและเงื่อนไขการใช้บริการเหล่านี้ทั้งหมด หากคุณไม่ตกลงตามเงื่อนไข โปรดระงับการใช้งานเว็บไซต์</p>
           </section>

           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase flex items-center gap-3">
                 <CheckCircle size={20} className="text-accent" /> 2. การสั่งซื้อสินค้า
              </h2>
              <p>คำสั่งซื้อจะมีผลสมบูรณ์เมื่อเราได้รับชำระเงินเต็มจำนวนแล้วเท่านั้น เราขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อในกรณีที่สินค้าหมด หรือเกิดข้อผิดพลาดด้านราคา โดยจะดำเนินการคืนเงินให้ลูกค้าเต็มจำนวน</p>
           </section>

           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase flex items-center gap-3">
                 <AlertCircle size={20} className="text-accent" /> 3. ทรัพย์สินทางปัญญา
              </h2>
              <p>เนื้อหาทั้งหมดบนเว็บไซต์นี้ รวมถึงแต่ไม่จำกัดเพียง ข้อความ กราฟิก โลโก้ รูปภาพ และซอฟต์แวร์ เป็นทรัพย์สินของ Duit Design Lab และได้รับการคุ้มครองตามกฎหมายทรัพย์สินทางปัญญา ห้ามมิให้ผู้ใดนำไปใช้โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร</p>
           </section>

           <div className="p-10 bg-neutral-50 rounded-[40px] border border-neutral-100 italic space-y-4">
              <p className="text-sm font-bold text-primary uppercase tracking-wider underline decoration-accent decoration-2 underline-offset-4">คำชี้แจงความรับผิดชอบ:</p>
              <p className="text-sm">ผลิตภัณฑ์ของ Duit ออกแบบมาเพื่อส่งเสริมคุณภาพชีวิตของสัตว์เลี้ยง แต่เจ้าของควรสังเกตพฤติกรรมและความเหมาะสมของสินค้าต่อสัตว์เลี้ยงแต่ละตัวเสมอ เราไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้งานผิดประเภท</p>
           </div>

           <section className="space-y-6">
              <h2 className="text-xl font-bold text-primary uppercase">4. การเปลี่ยนแปลงเงื่อนไข</h2>
              <p>เราอาจปรับปรุงเงื่อนไขเหล่านี้เป็นครั้งคราว การใช้งานอย่างต่อเนื่องของคุณหลังจากการเปลี่ยนแปลงถือว่าคุณยอมรับเงื่อนไขใหม่นั้น</p>
           </section>

           <div className="text-center pt-16 border-t border-neutral-100">
              <p className="text-[10px] font-black uppercase tracking-ultra text-neutral-400">Duit Thailand | Official Terms</p>
           </div>
        </div>
      </div>
    </div>
  );
}
