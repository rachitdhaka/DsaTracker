import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/dashboard/navbar";
import { QuestionsExplorer } from "@/components/dashboard/questions-explorer";

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

  // 2. Fetch all questions to populate the unified explorer
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, topic, title, link, leetcode_link, order_index")
    .order("order_index", { ascending: true });

  if (questionsError) {
    console.error("Error fetching questions:", questionsError.message);
  }

  // 3. Fetch user progress (Solved questions)
  const { data: solvedData, error: solvedError } = await supabase
    .from("user_progress")
    .select("question_id")
    .eq("user_id", user.id);

  if (solvedError) {
    console.error("Error fetching progress:", solvedError.message);
  }

  const solvedIds = solvedData?.map((s) => s.question_id) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar user={user} />

      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
        <QuestionsExplorer
          user={user}
          questions={questions || []}
          solvedIds={solvedIds}
        />
      </main>
    </div>
  );
}
