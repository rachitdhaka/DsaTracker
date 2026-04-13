import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Refined ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] bg-chart-1/5 blur-[160px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center text-center gap-12 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground/90 leading-tight">
            Solving problems you'll probably never use at work
          </h1>
          <div className="flex flex-col">
            <p className="text-sm md:text-base text-muted-foreground/80 font-medium max-w-sm mx-auto leading-relaxed">
              Tracking the legendary 450+ problems from
              <br />
              <a
                href="https://www.youtube.com/@LoveBabbar"
                target="_blank"
                className="text-foreground/90 font-medium"
              >
                Love Babbar's DSA sheet
              </a>
            </p>
            <p className="text-sm md:text-base text-muted-foreground/50 font-small max-w-sm mx-auto leading-relaxed">
              All credits to the man himself for the list.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Button
              asChild
              size="lg"
              className="px-8 rounded-md font-medium transition-all hover:bg-primary/95 active:scale-[0.98]"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                size="lg"
                className="px-8 rounded-md font-medium transition-all hover:bg-primary/95 active:scale-[0.98]"
              >
                <Link href="/login">
                  Get Started
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 rounded-md font-medium transition-all active:scale-[0.98]"
              >
                <Link href="/login">Login</Link>
              </Button>
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
