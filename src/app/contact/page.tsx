import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20">
        <div className="text-center py-24">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] tracking-ultra rounded-full mb-8 uppercase">Contact Us</span>
          <h1 className="text-5xl md:text-7xl tracking-tighter uppercase mb-10 leading-tight">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-lg text-secondary font-medium leading-relaxed">
            ทีมงาน Duit Thailand พร้อมดูแลคุณและสัตว์เลี้ยงตัวโปรด หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถติดต่อเราได้ทันที
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-neutral-50 rounded-[48px] p-8 md:p-16 border border-neutral-100 shadow-inner">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-2xl uppercase tracking-tight">Send a Message</h3>
            </div>
            
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-ultra text-neutral-400 ml-4">Full Name</label>
                  <input type="text" className="w-full h-16 bg-white border border-neutral-100 rounded-[20px] px-8 text-sm focus:ring-4 ring-accent/10 focus:border-accent transition-all outline-none shadow-sm" placeholder="Your Name" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-ultra text-neutral-400 ml-4">Email Address</label>
                  <input type="email" className="w-full h-16 bg-white border border-neutral-100 rounded-[20px] px-8 text-sm focus:ring-4 ring-accent/10 focus:border-accent transition-all outline-none shadow-sm" placeholder="Your Email" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-ultra text-neutral-400 ml-4">Subject</label>
                <input type="text" className="w-full h-16 bg-white border border-neutral-100 rounded-[20px] px-8 text-sm focus:ring-4 ring-accent/10 focus:border-accent transition-all outline-none shadow-sm" placeholder="How can we help you?" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-ultra text-neutral-400 ml-4">Message</label>
                <textarea className="w-full h-48 bg-white border border-neutral-100 rounded-[32px] p-8 text-sm focus:ring-4 ring-accent/10 focus:border-accent transition-all outline-none resize-none shadow-sm" placeholder="Tell us more about your inquiry..."></textarea>
              </div>
              <button className="w-full bg-primary text-white h-20 rounded-full uppercase tracking-ultra text-sm hover:bg-accent transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-95 duration-300">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
              <div className="p-10 rounded-[40px] bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Mail size={24} />
                </div>
                <h4 className="text-[10px] uppercase tracking-ultra text-neutral-400 mb-4">Email Support</h4>
                <p className="text-lg text-primary mb-1">support@duit.co.th</p>
                <p className="text-sm font-medium text-secondary">เราจะตอบกลับภายใน 24 ชม.</p>
              </div>
              
              <div className="p-10 rounded-[40px] bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Phone size={24} />
                </div>
                <h4 className="text-[10px] uppercase tracking-ultra text-neutral-400 mb-4">Phone Support</h4>
                <p className="text-lg text-primary mb-1">+66 (0) 2 123 4567</p>
                <p className="text-sm font-medium text-secondary">จันทร์ - ศุกร์: 9:30 - 17:00</p>
              </div>
            </div>

            <div className="p-10 rounded-[40px] bg-neutral-50 border border-neutral-100 space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-accent shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-ultra text-neutral-400 mb-2">Thailand Office</h4>
                  <p className="text-base text-primary leading-relaxed">
                    123 Sukhumvit Road, Khlong Toei, <br />
                    Bangkok 10110, Thailand
                  </p>
                </div>
              </div>
              <div className="flex gap-6 pt-10 border-t border-neutral-200">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-accent shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-ultra text-neutral-400 mb-2">Business Hours</h4>
                  <p className="text-base text-primary">09:30 AM – 05:00 PM</p>
                  <p className="text-sm font-medium text-secondary italic mt-1">(Closed on Weekends and Public Holidays)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
