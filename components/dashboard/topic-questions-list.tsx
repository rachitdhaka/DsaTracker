"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ExternalLink, ArrowLeft } from "lucide-react";
import { toggleQuestionStatus } from "@/app/dashboard/actions";

interface Question {
  id: string;
  title: string;
  link: string | null;
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom duration-500">
      <header className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group ring-1 ring-transparent hover:ring-slate-200/50"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {topicName}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {solvedSet.size} of {questions.length} problems completed
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No questions found for this topic.</p>
          </div>
        ) : (
          questions.map((q) => {
            const isSolved = solvedSet.has(q.id);
            const isLoading = loadingId === q.id;

            return (
              <div
                key={q.id}
                className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                  isSolved
                    ? "bg-blue-50/30 dark:bg-blue-900/5 border-blue-100/50 dark:border-blue-900/20"
                    : "bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(q.id)}
                    disabled={isLoading}
                    className={`shrink-0 h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                      isSolved
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-blue-400"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSolved && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-semibold truncate transition-colors ${
                        isSolved
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {q.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  {q.link && (
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                      title="View Problem"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <div className="p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Progress
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {Math.round((solvedSet.size / questions.length) * 100) || 0}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-600/20 transition-all duration-1000"
            style={{ width: `${(solvedSet.size / questions.length) * 100}%` }}
          />
        </div>
      </footer>
    </div>
  );
}
