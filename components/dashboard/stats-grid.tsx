import { CheckCircle2, Flame, Target, Trophy } from "lucide-react";

export function StatsGrid({ stats }: { stats: any }) {
  const items = [
    {
      label: "Daily Streak",
      value: stats.streak || 0,
      subValue: "+2 today",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Solved",
      value: stats.solved || 0,
      subValue: `/ ${stats.totalQuestions || 0}`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      showPercentage: true,
    },
  ];

  const percentage =
            Math.round((stats.solved / stats.totalQuestions) * 100) || 0;

  return (
    <section className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-card p-6 flex gap-8 rounded-xl transition-all duration-300 hover:bg-muted/50 group relative overflow-hidden border border-border flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px]  uppercase tracking-[0.2em] text-muted-foreground">
                {item.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl  tracking-tight text-foreground">
                  {item.value}
                </span>
                <span className={`text-[10px]  ${item.color} opacity-80 uppercase tracking-widest`}>
                  {item.subValue}
                </span>
              </div>
            </div>

            {item.showPercentage && (
              <div className="flex flex-col items-end">
                <span className="text-2xl  tracking-tight text-foreground">
                  {percentage}%
                </span>
                <span className="text-[9px]  uppercase tracking-widest text-muted-foreground">
                  Complete
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
