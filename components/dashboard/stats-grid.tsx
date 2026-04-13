import { CheckCircle2 } from "lucide-react";

export function StatsGrid({ stats }: { stats: any }) {
  const items = [
    {
      label: "Solved",
      value: stats.solved || 0,
      subValue: `/ ${stats.totalQuestions || 0}`,
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div
            className={`absolute -right-2 -top-2 p-6 transition-transform group-hover:scale-110 opacity-10 ${item.iconColor}`}
          >
            <item.icon size={64} />
          </div>

          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {item.label}
          </span>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {item.value}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {item.subValue}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
