import { evaluateQuiz } from "@/lib/quiz-engine";
import { participantKey } from "@/lib/participant";
import { loadActiveQuestions } from "@/lib/quiz-repository";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  sessionId: z.uuid(),
  participantFirstName: z.string().trim().min(2).max(50),
  participantLastName: z.string().trim().min(2).max(50),
  durationSeconds: z.number().int().min(1).max(7200),
  answers: z.array(z.object({ questionId: z.uuid(), optionId: z.enum(["A", "B", "C"]) })).min(1).max(100),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Dados da participação inválidos." }, { status: 400 });

  const { questions, mode } = await loadActiveQuestions();
  const submittedIds = parsed.data.answers.map((answer) => answer.questionId);
  const validOrder = questions.length === submittedIds.length && questions.every((question, index) => question.id === submittedIds[index]);
  if (!validOrder || new Set(submittedIds).size !== submittedIds.length) {
    return Response.json({ error: "A sequência de respostas não corresponde ao questionário atual." }, { status: 400 });
  }

  let evaluation;
  try {
    evaluation = evaluateQuiz(questions, parsed.data.answers);
  } catch {
    return Response.json({ error: "Uma das respostas não existe." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const storedDeviceId = cookieStore.get("finance_quiz_device")?.value;
  const deviceId = z.uuid().safeParse(storedDeviceId).success ? storedDeviceId! : crypto.randomUUID();
  const responseWithDevice = (body: object, status = 200) => {
    const response = NextResponse.json(body, { status });
    if (storedDeviceId !== deviceId) {
      response.cookies.set("finance_quiz_device", deviceId, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }
    return response;
  };

  const payload = { persisted: false, mode: "demo", attemptNumber: null, ...evaluation };
  const supabase = createSupabaseServiceClient();
  if (!supabase || mode === "demo") return responseWithDevice(payload, 202);

  const { data, error } = await supabase.from("quiz_results").insert({
    session_id: parsed.data.sessionId,
    participant_first_name: parsed.data.participantFirstName,
    participant_last_name: parsed.data.participantLastName,
    participant_key: participantKey(parsed.data.participantFirstName, parsed.data.participantLastName),
    device_key: deviceId,
    result: evaluation.result,
    score: evaluation.score,
    max_score: evaluation.maxScore,
    green_count: evaluation.greenCount,
    yellow_count: evaluation.yellowCount,
    red_count: evaluation.redCount,
    answers: parsed.data.answers,
    duration_seconds: parsed.data.durationSeconds,
  }).select("attempt_number").single();

  if (error) {
    if (error.code === "23505") {
      const { data: existing } = await supabase.from("quiz_results").select("attempt_number").eq("session_id", parsed.data.sessionId).maybeSingle();
      if (existing) return responseWithDevice({ persisted: true, mode: "database", attemptNumber: existing.attempt_number, ...evaluation });
    }
    console.error("Unable to persist quiz result", error.code);
    return responseWithDevice({ error: "Não foi possível salvar a participação." }, 500);
  }

  return responseWithDevice({ persisted: true, mode: "database", attemptNumber: data.attempt_number, ...evaluation });
}
