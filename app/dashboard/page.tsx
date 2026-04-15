import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/dashboard/navbar";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TopicMastery } from "@/components/dashboard/topic-mastery";
import { RecentSessions } from "@/components/dashboard/recent-sessions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/login");
  }

  // 2. Fetch all questions to calculate topic totals
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, topic, title, link");

  if (questionsError) {
    console.error("Error fetching questions:", questionsError.message);
  }

  console.log("--- DASHBOARD FETCH DEBUG ---");
  console.log("Questions count:", questions?.length || 0);
  console.log("User ID:", user.id);

  // 3. Fetch user progress (Solved questions)
  // Assuming 'user_id' and 'id' (question_id) exists in user_progress
  const { data: solvedData, error: solvedError } = await supabase
    .from("user_progress")
    .select("question_id")
    .eq("user_id", user.id);

  if (solvedError) {
    console.error("Error fetching progress:", solvedError.message);
  }

  const solvedIds = new Set(solvedData?.map((s) => s.question_id) || []);

  // 4. Processing data for UI
  const topicMap: Record<
    string,
    { name: string; total: number; solved: number }
  > = {};

  // Group all questions into topics and check if they are solved
  questions?.forEach((q: any) => {
    if (!topicMap[q.topic]) {
      topicMap[q.topic] = { name: q.topic, total: 0, solved: 0 };
    }
    topicMap[q.topic].total++;
    // In questions table, we usually have 'id'. seed script didn't show it but Supabase adds it.
    // We'll use question title/topic hash as a fallback if no id is visible in seed script
    // However, usually questios have a UUID. Let's assume 'id' column exists.
    if (solvedIds.has(q.id)) {
      topicMap[q.topic].solved++;
    }
  });

  const TOPIC_ORDER = [
    "Array",
    "Matrix",
    "String",
    "Searching & Sorting",
    "LinkedList",
    "Binary Trees",
    "Binary Search Trees",
    "Greedy",
    "BackTracking",
    "Stacks & Queues",
    "Heap",
    "Graph",
    "Trie",
    "Dynamic Programming",
    "Bit Manipulation",
  ];

  const topicsArray = Object.values(topicMap).sort((a, b) => {
    const indexA = TOPIC_ORDER.indexOf(a.name);
    const indexB = TOPIC_ORDER.indexOf(b.name);
    // If topic is not in our list, put it at the end
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });
  const totalSolved = solvedIds.size;
  const totalQuestions = questions?.length || 0;

  const accuracy =
    totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : 0;

  const stats = {
    streak: totalSolved > 0 ? 1 : 0, // Simplified streak logic
    solved: totalSolved,
    totalQuestions: totalQuestions,
    accuracy: accuracy,
    rank: "N/A", // Real ranking requires a leaderboard table
    rankChange: 0,
    todaySolved: 0, // Real today solved requires timestamps in user_progress
  };

  // 5. Fetch Recent Activity (Live data)
  const { data: recentActivity, error: activityError } = await supabase
    .from("user_progress")
    .select(
      `
      question_id,
      created_at,
      questions (
        title,
        topic
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (activityError) {
    console.error("Error fetching activity:", activityError.message);
  }

  const liveSessions =
    recentActivity?.map((act: any) => ({
      title: act.questions?.title || "Unknown Problem",
      topic: act.questions?.topic || "General",
      timeAgo: new Date(act.created_at).toLocaleDateString(),
      difficulty: "Medium", // Could be added to questions table later
      runtime: "---",
    })) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar user={user} />

      <main className="pt-20 pb-20 px-8 max-w-[90rem] mx-auto space-y-10">
        {/* Stats Bento Grid */}
        <div className="animate-in mt-10 fade-in slide-in-from-bottom duration-1000">
          <StatsGrid stats={stats} />
        </div>

        {/* Topic Mastery Matrix */}
        <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-150">
          <TopicMastery topics={topicsArray} />
        </div>

        {/* Recent Activity */}
        <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <RecentSessions sessions={liveSessions} />
        </div>
      </main>
    </div>
  );
}
