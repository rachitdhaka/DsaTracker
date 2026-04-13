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
    <section className="space-y-10">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl  tracking-tight text-foreground">
            Topic Mastery Matrix
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Your architectural journey through data structures.
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
              className=" flex justify-between gap-5 bg-card p-6 rounded-xl transition-all duration-300 cursor-pointer group active:scale-[0.98] hover:bg-muted/50 border border-border"
            >
              <div className="space-y-1">
                <h3 className="text-xl  tracking-tight transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-green-500 transition-colors uppercase tracking-tight">
                  {topic.solved} / {topic.total} <span className="ml-4">Solved</span>
                </p>
              </div>


              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px]  tracking-widest  bg-muted text-foreground px-2.5 py-1 rounded-full transition-all duration-500 border border-border">
                  {percentage}%
                </span>
              </div>



            </div>
          );
        })}
      </div>
    </section>
  );
}
