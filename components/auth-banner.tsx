import Link from 'next/link'
import { LogIn } from 'lucide-react'

export function AuthBanner() {
  return (
    <div className="relative group w-full overflow-hidden bg-zinc-950 text-zinc-100 border-b border-zinc-800/50">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 opacity-50 transition-opacity group-hover:opacity-100" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <LogIn className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium tracking-tight text-zinc-300">
            Your progress is not being saved. <span className="hidden sm:inline text-zinc-500">Sign in to sync your data across devices.</span>
          </p>
        </div>
        
        <Link 
          href="/login" 
          className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white hover:scale-105 transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
