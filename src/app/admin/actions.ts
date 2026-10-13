"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.object({ email: z.email(), password: z.string().min(6).max(128) }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Informe um e-mail válido e sua senha." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Conecte o Supabase para liberar o acesso administrativo." };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "E-mail ou senha incorretos." };
  const { data: allowlisted } = await supabase.from("admin_users").select("email").ilike("email", data.user.email ?? "").maybeSingle();
  if (!allowlisted) {
    await supabase.auth.signOut();
    return { error: "Este usuário não está autorizado a acessar o painel." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

const questionSchema = z.object({
  questionId: z.union([z.literal(""), z.uuid()]),
  position: z.coerce.number().int().min(1).max(999),
  prompt: z.string().trim().min(10).max(600),
  explanation: z.string().trim().min(10).max(800),
  optionA: z.string().trim().min(2).max(500),
  optionB: z.string().trim().min(2).max(500),
  optionC: z.string().trim().min(2).max(500),
  colorA: z.enum(["verde", "amarelo", "vermelho"]),
  colorB: z.enum(["verde", "amarelo", "vermelho"]),
  colorC: z.enum(["verde", "amarelo", "vermelho"]),
});

export async function saveQuestionAction(formData: FormData) {
  const parsed = questionSchema.safeParse({
    questionId: formData.get("questionId"), position: formData.get("position"),
    prompt: formData.get("prompt"), explanation: formData.get("explanation"),
    optionA: formData.get("optionA"), optionB: formData.get("optionB"), optionC: formData.get("optionC"),
    colorA: formData.get("colorA"), colorB: formData.get("colorB"), colorC: formData.get("colorC"),
  });
  if (!parsed.success) redirect("/admin/questions?error=invalid");
  const { configured, supabase } = await getAdminContext();
  if (!configured) redirect("/admin/questions?error=demo");
  const payload = {
    position: parsed.data.position, prompt: parsed.data.prompt, explanation: parsed.data.explanation,
    active: formData.get("active") === "on",
    options: [
      { id: "A", text: parsed.data.optionA, color: parsed.data.colorA },
      { id: "B", text: parsed.data.optionB, color: parsed.data.colorB },
      { id: "C", text: parsed.data.optionC, color: parsed.data.colorC },
    ],
  };
  const operation = parsed.data.questionId
    ? supabase.from("quiz_questions").update(payload).eq("id", parsed.data.questionId)
    : supabase.from("quiz_questions").insert(payload);
  const { error } = await operation;
  if (error) redirect("/admin/questions?error=save");
  revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/questions");
  redirect("/admin/questions?saved=1");
}
