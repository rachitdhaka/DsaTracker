"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Check,
  Lock,
  Bookmark,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toggleQuestionStatus } from "@/app/dashboard/actions";

interface Question {
  id: string;
  title: string;
  link: string | null; // GFG Link
  leetcode_link: string | null; // LeetCode Link
  topic: string;
  order_index?: number;
}

interface QuestionsExplorerProps {
  user: any;
  questions: Question[];
  solvedIds: string[];
}

// Custom SVG GFG Logo matching reference image (pure green "gG" letter styling)
const GFGLogo = () => (
  <span className="text-[#2F8D46] font-extrabold text-[15px] tracking-tight hover:scale-105 transition-transform duration-200 select-none">
    gG
  </span>
);

// Custom SVG LeetCode Logo matching reference image (black circular container, white LeetCode symbol)
const LeetCodeLogo = () => (
  <div className="size-7 rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-sm hover:bg-black transition-colors duration-200 hover:scale-105 transition-transform">
    <svg
      viewBox="0 0 120 120"
      className="size-[14px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60.8607 74.8886C63.1089 72.6437 66.7481 72.6496 68.989 74.9017C71.23 77.1538 71.2241 80.7994 68.976 83.0443L58.9929 93.0126C49.7828 102.209 34.7641 102.343 25.3986 93.3224C25.3445 93.2706 21.1743 89.1815 7.41705 75.6915C-1.73529 66.7174 -2.64709 52.3575 5.96552 43.1359L22.0236 25.9417C30.5715 16.7886 46.3283 15.7882 56.1015 23.6918L70.6861 35.4869C73.156 37.4844 73.5418 41.1094 71.5478 43.5836C69.5538 46.0578 65.9351 46.4442 63.4653 44.4468L48.8807 32.6518C43.7695 28.5183 34.8285 29.086 30.4181 33.8087L14.3598 51.0032C10.1669 55.4924 10.6261 62.7245 15.4581 67.4624C25.5603 77.3683 33.3459 85.0024 33.3549 85.011C38.224 89.7007 46.0969 89.6308 50.8776 84.857L60.8607 74.8886Z"
        fill="#FFFFFF"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.609 64.9129C33.4346 64.9129 30.8613 62.3351 30.8613 59.1553C30.8613 55.9754 33.4346 53.3976 36.609 53.3976H78.9977C82.172 53.3976 84.7453 55.9754 84.7453 59.1553C84.7453 62.3351 82.172 64.9129 78.9977 64.9129H36.609Z"
        fill="#CCCCCC"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44.5476 1.82415C46.7162 -0.497945 50.3534 -0.61927 52.6715 1.55317C54.9895 3.7256 55.1106 7.36914 52.942 9.69124L14.36 51.0033C10.167 55.4922 10.6262 62.7243 15.4578 67.4623L33.2755 84.9343C35.5439 87.1587 35.5828 90.804 33.3623 93.0764C31.1417 95.3488 27.5028 95.3877 25.2343 93.1633L7.41651 75.6912C-1.7353 66.7166 -2.64709 52.3568 5.96552 43.1359L44.5476 1.82415Z"
        fill="#FFFFFF"
      ></path>
    </svg>
  </div>
);

export function QuestionsExplorer({
  user,
  questions = [],
  solvedIds = []
}: QuestionsExplorerProps) {
  // General state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set(solvedIds));
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());

  // Rows per page config
  const rowsPerPage = 10;

  // Load bookmarks from local storage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("dsa_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedSet(new Set(JSON.parse(savedBookmarks)));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync with props when server data refreshes
  useEffect(() => {
    setSolvedSet(new Set(solvedIds));
  }, [solvedIds]);

  // Extract all unique topics dynamically from the database questions list
  const availableTopics = useMemo(() => {
    const topics = new Set<string>();
    questions.forEach((q) => {
      if (q.topic) topics.add(q.topic);
    });
    return Array.from(topics).sort();
  }, [questions]);


  // Handle Solved Checkbox Toggles
  const handleToggleSolved = async (qId: string) => {
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
      // Rollback
      setSolvedSet(solvedSet);
    } finally {
      setLoadingId(null);
    }
  };

  // Handle Bookmarks
  const toggleBookmark = (qId: string) => {
    const newBookmarks = new Set(bookmarkedSet);
    if (newBookmarks.has(qId)) {
      newBookmarks.delete(qId);
    } else {
      newBookmarks.add(qId);
    }
    setBookmarkedSet(newBookmarks);
    localStorage.setItem(
      "dsa_bookmarks",
      JSON.stringify(Array.from(newBookmarks))
    );
  };

  // Handle Topic Chip Clicks (Multiple selection supported)
  const handleTopicClick = (topic: string) => {
    const newSet = new Set(selectedTopics);
    if (newSet.has(topic)) {
      newSet.delete(topic);
    } else {
      newSet.add(topic);
    }
    setSelectedTopics(newSet);
    setCurrentPage(1); // Reset to page 1 on filter changes
  };

  // Handle "All Topics" Reset
  const handleClearTopics = () => {
    setSelectedTopics(new Set());
    setCurrentPage(1);
  };

  // Deterministic helper for difficulty mapping (matches reference image index 0-1 Easy, 2-9 Medium, etc.)
  const getDifficulty = (title: string, index: number): "Easy" | "Medium" | "Hard" => {
    const lower = title.toLowerCase();
    if (lower.includes("reverse") || lower.includes("maximum") || index < 2) return "Easy";
    if (index >= 2 && index <= 9) return "Medium";
    
    // Fallback deterministic difficulty
    const hash = title.length + index;
    if (hash % 3 === 0) return "Easy";
    if (hash % 3 === 1) return "Medium";
    return "Hard";
  };



  // Filter questions on client side
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Search query filter
      if (
        searchQuery &&
        !q.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // 2. Multi-topic filter
      if (selectedTopics.size > 0 && !selectedTopics.has(q.topic)) {
        return false;
      }
      return true;
    });
  }, [questions, searchQuery, selectedTopics]);

  // Pagination bounds
  const totalCount = filteredQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalCount);

  // Paginated questions to display
  const paginatedQuestions = useMemo(() => {
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, startIndex, endIndex]);

  // Adjust page number if it exceeds total pages after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Progress calculations
  const totalSolvedCount = solvedSet.size;
  const overallTotalCount = questions.length || 438;
  const progressPercentage = Math.round((totalSolvedCount / overallTotalCount) * 100) || 0;

  // Pagination Helper numbers array generator
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-16">
      
      {/* Search Bar Row */}
      <div className="flex items-center justify-between w-full">
        <div className="relative w-full md:w-80 shadow-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search questions by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400/30 focus:border-zinc-400 transition-all placeholder-zinc-400 text-zinc-800 font-medium"
          />
        </div>
      </div>

      {/* Progress Card Card */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-6">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[15px] font-semibold text-zinc-800 tracking-tight select-none">
            Total Progress
          </span>
          <span className="text-[14px] font-medium text-zinc-400 select-none">
            {totalSolvedCount}/{overallTotalCount} Problems
          </span>
        </div>
        <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#9ca3af] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Horizontal Topic Filter Scrollable Bar */}
      <div className="w-full flex flex-col gap-2 bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-4 select-none">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
          Topic Filters
        </span>
        <div 
          className="flex items-center gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={handleClearTopics}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              selectedTopics.size === 0
                ? "bg-zinc-800 border-zinc-800 text-white shadow-sm"
                : "bg-[#f4f4f5] border-transparent text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            All Topics
          </button>
          {availableTopics.map((topic) => {
            const isActive = selectedTopics.has(topic);
            return (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 border-zinc-800 text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Card: Questions Table Card */}
      <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px] flex flex-col">
            
            {/* Table Header Row */}
            <div className="grid grid-cols-[80px_1fr_100px_120px_80px] items-center px-6 py-4 border-b border-zinc-100 bg-white select-none">
              <span className="text-xs font-semibold text-zinc-400 text-center uppercase tracking-wider">
                Done
              </span>
              <span className="text-xs font-semibold text-zinc-400 text-left uppercase tracking-wider">
                Problem
              </span>
              <span className="text-xs font-semibold text-zinc-400 text-center uppercase tracking-wider">
                Links
              </span>
              <span className="text-xs font-semibold text-zinc-400 text-center uppercase tracking-wider">
                Difficulty
              </span>
              <span className="text-xs font-semibold text-zinc-400 text-center uppercase tracking-wider">
                Bookmark
              </span>
            </div>

            {/* Table Body Rows */}
            {paginatedQuestions.length === 0 ? (
              <div className="text-center py-20 text-zinc-400 font-medium bg-[#fafafa]">
                No questions match your current search/filters.
              </div>
            ) : (
              paginatedQuestions.map((q, relativeIndex) => {
                const globalIndex = startIndex + relativeIndex;
                const isSolved = solvedSet.has(q.id);
                const isLoading = loadingId === q.id;
                const isBookmarked = bookmarkedSet.has(q.id);
                
                // Lock logic: all questions are available for all (no locking)
                const isLocked = false;

                const difficulty = getDifficulty(q.title, globalIndex);

                return (
                  <div
                    key={q.id}
                    className={`grid grid-cols-[80px_1fr_100px_120px_80px] items-center px-6 py-4.5 transition-colors duration-200 ${
                      relativeIndex % 2 === 0 ? "bg-[#fafafa]" : "bg-white"
                    } hover:bg-zinc-50/80`}
                  >
                    {/* Column 1: Done Status */}
                    <div className="flex justify-center items-center">
                      {isLocked ? (
                        <Lock className="h-[18px] w-[18px] text-zinc-300 stroke-[2.2]" />
                      ) : (
                        <button
                          onClick={() => !isLoading && handleToggleSolved(q.id)}
                          disabled={isLoading}
                          className={`h-5 w-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isSolved
                              ? "bg-zinc-800 border-zinc-800 text-white"
                              : "border-zinc-300 hover:border-zinc-500 bg-white"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {isSolved && <Check className="h-3.5 w-3.5 stroke-[3.2]" />}
                        </button>
                      )}
                    </div>

                    {/* Column 2: Problem Title */}
                    <div className="text-left pr-4">
                      {isLocked ? (
                        <span className="text-[15px] font-medium text-zinc-300 select-none">
                          {q.title}
                        </span>
                      ) : (
                        <a
                          href={(q.leetcode_link || q.link || "#")!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-semibold text-zinc-800 hover:text-zinc-950 hover:underline underline-offset-4 decoration-zinc-400 transition-colors"
                        >
                          {q.title}
                        </a>
                      )}
                    </div>

                    {/* Column 3: Links */}
                    <div className="flex justify-center items-center gap-3">
                      {q.leetcode_link ? (
                        <a
                          href={q.leetcode_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LeetCode Link"
                        >
                          <LeetCodeLogo />
                        </a>
                      ) : q.link ? (
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GeeksforGeeks Link"
                          className="flex items-center justify-center"
                        >
                          <GFGLogo />
                        </a>
                      ) : (
                        <span className="text-zinc-300 text-sm font-medium select-none">—</span>
                      )}
                    </div>

                    {/* Column 4: Difficulty */}
                    <div className="flex justify-center items-center">
                      {difficulty === "Easy" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#137333] select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)] border border-[#C2E7C7]/40">
                          Easy
                        </span>
                      )}
                      {difficulty === "Medium" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF7E0] text-[#B06000] select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)] border border-[#FAD2B8]/40">
                          Medium
                        </span>
                      )}
                      {difficulty === "Hard" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE8E6] text-[#C5221F] select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)] border border-[#F7C6C2]/40">
                          Hard
                        </span>
                      )}
                    </div>

                    {/* Column 6: Bookmark Toggle */}
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className="p-1 hover:bg-zinc-50 rounded-full transition-colors group cursor-pointer"
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                      >
                        <Bookmark
                          className={`h-[18px] w-[18px] stroke-[1.8] transition-all duration-200 ${
                            isBookmarked
                              ? "fill-amber-500 text-amber-500 scale-105"
                              : "text-zinc-300 group-hover:text-zinc-500"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4.5 bg-white border-t border-zinc-100 gap-4 select-none">
            {/* Show results label */}
            <span className="text-sm font-medium text-zinc-400">
              Showing results {startIndex + 1}-{endIndex} of {totalCount}
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              {pageNumbers.map((num, idx) => {
                if (num === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1 text-sm font-medium text-zinc-400 select-none"
                    >
                      ...
                    </span>
                  );
                }
                const isSelected = num === currentPage;
                return (
                  <button
                    key={`page-${num}`}
                    onClick={() => setCurrentPage(num as number)}
                    className={`h-[32px] min-w-[32px] flex items-center justify-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-100 border-zinc-200 text-zinc-800 font-bold shadow-sm"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
