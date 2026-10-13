import { toPublicQuestion } from "@/lib/quiz-engine";
import { loadActiveQuestions } from "@/lib/quiz-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const { questions, mode } = await loadActiveQuestions();
  return Response.json({ questions: questions.map(toPublicQuestion), mode });
}
