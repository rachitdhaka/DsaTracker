import { CheckCircle2, Clock } from "lucide-react";

export function RecentSessions({ sessions }: { sessions: any[] }) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <section className="bg-card rounded-xl p-6 space-y-6 border border-border">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Recent Sessions
      </h2>
      <div className="space-y-4">
        {sessions.map((session, i) => (
          <div
            key={i}
            className="bg-muted/30 p-4 rounded-xl flex items-center justify-between transition-all duration-300 hover:bg-muted/50 group border border-border/50"
          >
            <div className="flex items-center gap-5">
              <div className="size-10 rounded-full bg-background flex items-center justify-center border border-border">
                <CheckCircle2 className="h-5 w-5 text-foreground" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base tracking-tight">
                  {session.title}
                </h4>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-background/60 transition-colors">
                  <span>{session.topic}</span>
                  <span className="size-1 rounded-full bg-border group-hover:bg-background/20" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{session.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-border/50 ${
                  session.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : session.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {session.difficulty}
              </span>
              <span className="text-xs font-mono font-bold opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                {session.runtime || "---"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
