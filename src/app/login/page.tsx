import { login, signup } from './actions'
import Link from 'next/link'
import { ArrowRight, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center pt-20 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 shadow-luxury border border-neutral-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-8 sm:space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-primary">Login</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">Access the Inner Circle</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="Email Address"
                  className="w-full bg-cream-light border border-neutral-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="Password"
                  className="w-full bg-cream-light border border-neutral-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>
            </div>

            <button 
              formAction={login}
              className="w-full h-16 bg-primary text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-accent-gold transition-colors shadow-luxury group"
            >
              Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Don't have an account? <Link href="/register" className="text-accent-gold hover:text-primary transition-colors border-b border-accent-gold/30 hover:border-primary pb-1 ml-2">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
