"use client";

import {
  BarChart2,
  Search,
  Network,
  Layers,
  Zap,
  Hash,
  GitBranch,
  Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/utils/slugify";

const TOPIC_ICONS: Record<string, any> = {
  Array: BarChart2,
  Matrix: Layers,
  String: Hash,
  "Searching & Sorting": Search,
  LinkedList: Link2,
  "Binary Trees": Network,
  "Binary Search Trees": Zap,
  Greedy: GitBranch,
  BackTracking: GitBranch,
  "Stacks & Queues": Layers,
  Heap: BarChart2,
  Graph: Network,
  Trie: GitBranch,
  "Dynamic Programming": Zap,
  "Bit Manipulation": Hash,
};

export function TopicMastery({ topics }: { topics: any[] }) {
  const router = useRouter();

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Topic Mastery Matrix
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a topic to view curated problems and track your progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {topics.map((topic, i) => {
          const Icon = TOPIC_ICONS[topic.name] || BarChart2;
          const percentage =
            Math.round((topic.solved / topic.total) * 100) || 0;

          return (
            <div
              key={i}
              onClick={() => router.push(`/topic/${slugify(topic.name)}`)}
              className="bg-white dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-sm group hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-500 cursor-pointer active:scale-95 hover:shadow-xl hover:shadow-blue-600/10 relative overflow-hidden"
            >
              {/* Decorative background gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />

              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl group-hover:bg-white/20 transition-all duration-500 group-hover:rotate-12">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black tracking-widest uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-all duration-500 shadow-sm">
                    {percentage}%
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-white transition-colors mb-1">
                {topic.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-white/70 transition-colors">
                {topic.solved} / {topic.total} Problems
              </p>

              <div className="mt-6 h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden group-hover:bg-white/20 transition-all duration-500">
                <div
                  className="h-full bg-blue-600 rounded-full group-hover:bg-white transition-all duration-700 ease-out shadow-[0_0_12px_rgba(37,99,235,0.4)] group-hover:shadow-none"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
