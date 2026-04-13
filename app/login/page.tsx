import { LoginButtons } from './login-buttons'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 overflow-hidden selection:bg-chart-1/10">
      {/* Refined ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-chart-1/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Link 
          href="/" 
          className="absolute -top-16 left-0 flex items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-widest group"
        >
          <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
          Home
        </Link>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-medium tracking-tight text-foreground/90">
              Welcome back.
            </h1>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground/70 font-medium">
                Choose your preferred sign-in method
              </p>
              <p className="text-[10px] text-muted-foreground/30 font-medium italic tracking-wide">
                (Options ki bharmaar, waise darwaza ek hi hai)
              </p>
            </div>
          </div>
        </div>

        <LoginButtons />

        <div className="flex flex-col items-center gap-6">
          <div className="h-px w-12 bg-outline-variant" />
          <p className="text-center text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.15em] leading-relaxed px-10">
            Secure authentication handled via Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
