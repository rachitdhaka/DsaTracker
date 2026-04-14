import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Top action area */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Refined ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-chart-1/5 blur-[160px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center text-center gap-12 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground/90 leading-tight">
            The Ultimate Love Babbar 450 DSA Sheet Tracker
          </h1>
          <div className="flex flex-col">
            <p className="text-sm md:text-base text-muted-foreground/80 font-medium max-w-sm mx-auto leading-relaxed">
              Master the legendary 450+ data structures and algorithms questions from 
              <br />
              <a
                href="https://www.youtube.com/@LoveBabbar"
                target="_blank"
                className="text-foreground/90 font-medium"
              >
                Love Babbar's famous DSA sheet
              </a>
            </p>
            <p className="text-sm md:text-base text-muted-foreground/50 font-small max-w-sm mx-auto leading-relaxed">
              Track your progress, save notes, and prepare for top-tier tech interviews.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link 
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 rounded-md font-medium transition-all hover:bg-primary/95 active:scale-[0.98]"
              )}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "px-8 rounded-md font-medium transition-all hover:bg-primary/95 active:scale-[0.98]"
                )}
              >
                Get Started
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link 
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "px-8 rounded-md font-medium transition-all active:scale-[0.98]"
                )}
              >
                Login
              </Link>
            </>
          )}
        </div>

       
      </main>

      <footer className="absolute bottom-12 flex items-center gap-2 opacity-20">
        <div className=" size-1 rounded-full bg-chart-1" />
        <div className="flex flex-col text-center">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
            DSA Tracker
          </p>
          <p className="text-sm md:text-base text-muted-foreground/80 font-medium max-w-sm mx-auto leading-relaxed">
            More sheets coming soon... or whenever I stop procrastinating.
          </p>
        </div>
        
      </footer>
    </div>
  );
}
