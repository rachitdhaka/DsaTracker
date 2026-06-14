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

  // Redirect to the unified dashboard explorer
  return redirect("/dashboard");
}
