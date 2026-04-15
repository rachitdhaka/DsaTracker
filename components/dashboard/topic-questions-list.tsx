"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { toggleQuestionStatus } from "@/app/dashboard/actions";

interface Question {
  id: string;
  title: string;
  link: string | null; // GFG Link
  leetcode_link: string | null; // LeetCode Link
  topic: string;
}

interface TopicQuestionsListProps {
  topicName: string;
  questions: Question[];
  solvedIds: string[];
}

export function TopicQuestionsList({
  topicName,
  questions,
  solvedIds,
}: Omit<TopicQuestionsListProps, "onClose">) {
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set(solvedIds));
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync with props when server refreshes
  useEffect(() => {
    setSolvedSet(new Set(solvedIds));
  }, [solvedIds]);

  const handleToggle = async (qId: string) => {
    const isCurrentlySolved = solvedSet.has(qId);
    setLoadingId(qId);

    // Optimistic UI update
    const newSet = new Set(solvedSet);
    if (isCurrentlySolved) {
      newSet.delete(qId);
    } else {
      newSet.add(qId);
    }
    setSolvedSet(newSet);

    try {
      await toggleQuestionStatus(qId, !isCurrentlySolved);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Rollback on error
      setSolvedSet(solvedSet);
    } finally {
      setLoadingId(null);
    }
  };

  const GFGLogo = () => (
    <img
      src="https://media.geeksforgeeks.org/gfg-gg-logo.svg"
      alt="GFG"
      className="size-4"
    />
  );

  const LeetCodeLogo = () => (
    <svg
      viewBox="0 0 120 120"
      className="size-4 fill-[#FFA116]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60.8607 74.8886C63.1089 72.6437 66.7481 72.6496 68.989 74.9017C71.23 77.1538 71.2241 80.7994 68.976 83.0443L58.9929 93.0126C49.7828 102.209 34.7641 102.343 25.3986 93.3224C25.3445 93.2706 21.1743 89.1815 7.41705 75.6915C-1.73529 66.7174 -2.64709 52.3575 5.96552 43.1359L22.0236 25.9417C30.5715 16.7886 46.3283 15.7882 56.1015 23.6918L70.6861 35.4869C73.156 37.4844 73.5418 41.1094 71.5478 43.5836C69.5538 46.0578 65.9351 46.4442 63.4653 44.4468L48.8807 32.6518C43.7695 28.5183 34.8285 29.086 30.4181 33.8087L14.3598 51.0032C10.1669 55.4924 10.6261 62.7245 15.4581 67.4624C25.5603 77.3683 33.3459 85.0024 33.3549 85.011C38.224 89.7007 46.0969 89.6308 50.8776 84.857L60.8607 74.8886Z"
        fill="#FFA116"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M36.609 64.9129C33.4346 64.9129 30.8613 62.3351 30.8613 59.1553C30.8613 55.9754 33.4346 53.3976 36.609 53.3976H78.9977C82.172 53.3976 84.7453 55.9754 84.7453 59.1553C84.7453 62.3351 82.172 64.9129 78.9977 64.9129H36.609Z"
        fill="#B3B3B3"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M44.5476 1.82415C46.7162 -0.497945 50.3534 -0.61927 52.6715 1.55317C54.9895 3.7256 55.1106 7.36914 52.942 9.69124L14.36 51.0033C10.167 55.4922 10.6262 62.7243 15.4578 67.4623L33.2755 84.9343C35.5439 87.1587 35.5828 90.804 33.3623 93.0764C31.1417 95.3488 27.5028 95.3877 25.2343 93.1633L7.41651 75.6912C-1.7353 66.7166 -2.64709 52.3568 5.9659 43.1359L44.5476 1.82415Z"
        fill="#F5F5F5"
      ></path>
    </svg>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom duration-500">
      <header className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="p-2.5 hover:bg-muted rounded-xl transition-all border border-border group"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {topicName}
            </h2>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              {solvedSet.size} of {questions.length} problems completed
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No questions found for this topic.
            </p>
          </div>
        ) : (
          questions.map((q) => {
            const isSolved = solvedSet.has(q.id);
            const isLoading = loadingId === q.id;

            return (
              <div
                key={q.id}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  isSolved
                    ? "bg-muted/30 border-border"
                    : "bg-card border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(q.id)}
                    disabled={isLoading}
                    className={`shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      isSolved
                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background hover:border-foreground/50"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSolved && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {q.link || q.leetcode_link ? (
                      <a
                        href={(q.leetcode_link || q.link)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link block hover:underline decoration-primary/40 underline-offset-4"
                      >
                        <h3 className="text-[15px] font-semibold truncate text-foreground group-hover/link:text-primary transition-colors">
                          {q.title}
                        </h3>
                      </a>
                    ) : (
                      <h3 className="text-[15px] font-semibold truncate text-foreground">
                        {q.title}
                      </h3>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {q.link && (
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-background text-muted-foreground hover:text-[#2F8D46] hover:bg-[#2F8D46]/10 transition-all border border-border group/gfg"
                      title="GeeksforGeeks"
                    >
                      <GFGLogo />
                    </a>
                  )}
                  {q.leetcode_link && (
                    <a
                      href={q.leetcode_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-black text-muted-foreground hover:text-[#FFA116] hover:bg-[#FFA116]/10 transition-all border border-border group/lc"
                      title="LeetCode"
                    >
                      <LeetCodeLogo />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="p-6 border-t border-border bg-muted/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-foreground">Progress</span>
          <span className="text-sm font-bold text-primary">
            {Math.round((solvedSet.size / questions.length) * 100) || 0}%
            Complete
          </span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${(solvedSet.size / questions.length) * 100}%` }}
          />
        </div>
      </footer>
    </div>
  );
}
