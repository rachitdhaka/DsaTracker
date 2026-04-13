import { CheckCircle2, Clock } from "lucide-react";

export function RecentSessions({ sessions }: { sessions: any[] }) {
  if (!sessions || sessions.length === 0) {
    return (
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No recent activity. Start solving to see your progress here!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Recent Sessions
      </h2>
      <div className="space-y-3">
        {sessions.map((session, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {session.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{session.topic}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <Clock className="h-3 w-3" />
                  <span>{session.timeAgo}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  session.difficulty === "Easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : session.difficulty === "Medium"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                }`}
              >
                {session.difficulty}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
                {session.runtime || "---"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
