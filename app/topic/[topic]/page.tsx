import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/dashboard/navbar";
import { TopicQuestionsList } from "@/components/dashboard/topic-questions-list";
import { unslugify } from "@/utils/slugify";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicParam } = await params;
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

  // 2. Fetch questions for this topic
  // We use ilike to be case-insensitive and handle the slug comparison
  // Note: unslugify helps but we might need a more robust match
  const readableTopic = unslugify(topicParam);
  
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .ilike("topic", readableTopic);

  if (questionsError || !questions) {
    console.error("Error fetching questions:", questionsError?.message);
  }

  // 3. Fetch user progress
  const { data: solvedData } = await supabase
    .from("user_progress")
    .select("question_id")
    .eq("user_id", user.id);

  const solvedIds = solvedData?.map((s) => s.question_id) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar user={user} />

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <TopicQuestionsList
          topicName={questions?.[0]?.topic || readableTopic}
          questions={questions || []}
          solvedIds={solvedIds}
        />
      </main>
    </div>
  );
}
