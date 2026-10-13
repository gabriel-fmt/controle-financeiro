import { quizQuestions } from "@/quiz-config/questions";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { QuizQuestion } from "@/types/quiz";

export async function loadActiveQuestions(): Promise<{ questions: QuizQuestion[]; mode: "database" | "demo" }> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { questions: quizQuestions, mode: "demo" };
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id, position, prompt, explanation, active, options")
    .eq("active", true)
    .order("position", { ascending: true });
  if (error || !data?.length) return { questions: quizQuestions, mode: "demo" };
  return { questions: data as QuizQuestion[], mode: "database" };
}
