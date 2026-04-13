import { LoginButtons } from './login-buttons'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
        <Link 
          href="/" 
          className="absolute -top-16 left-0 flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors text-sm group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 flex items-center justify-center shadow-xl">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center">
              <div className="h-4 w-4 bg-zinc-900 rounded-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-zinc-400 text-sm">Choose your preferred sign-in method</p>
          </div>
        </div>

        <LoginButtons />

        <p className="text-center text-xs text-zinc-500 leading-relaxed px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy. 
          Authentication is handled securely via Supabase.
        </p>
      </div>
    </div>
  )
}
