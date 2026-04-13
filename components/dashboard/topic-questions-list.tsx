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
            <p className="text-slate-500 dark:text-slate-400">No questions found for this topic.</p>
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
                    <h3 className="text-[15px] font-semibold truncate text-foreground">
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
                      className="p-2 rounded-lg bg-background text-muted-foreground hover:text-foreground transition-all border border-border"
                      title="View Problem"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <div className="p-1.5 rounded-lg border border-border group-hover:bg-muted transition-all">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="p-6 border-t border-border bg-muted/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-foreground">
            Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round((solvedSet.size / questions.length) * 100) || 0}% Complete
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
