import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowRight, LayoutDashboard } from 'lucide-react'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl gap-8 animate-in fade-in zoom-in duration-1000">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
          <LayoutDashboard className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            DSA Tracker
          </h1>
          <p className="text-slate-400 text-lg">
            Master your analytical skills with a premium dashboard, real-time progress tracking, and 450+ curated problems.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {user ? (
            <Link 
              href="/dashboard" 
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="pt-8 border-t border-slate-800 w-full">
          <p className="text-slate-500 text-sm">
            Powered by Supabase & Next.js
          </p>
        </div>
      </div>
    </div>
  )
}

