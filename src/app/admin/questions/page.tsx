import { saveQuestionAction } from "@/app/admin/actions";
import { getAdminContext } from "@/lib/admin-auth";
import { quizQuestions } from "@/quiz-config/questions";
import type { DecisionColor, QuizQuestion } from "@/types/quiz";
import { ArrowLeft, BookOpenCheck, CircleAlert, Plus, Save, WalletCards } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const colorLabels: Record<DecisionColor, string> = { verde: "Verde — consciente", amarelo: "Amarelo — atenção", vermelho: "Vermelho — arriscada" };

export default async function QuestionsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const query = await searchParams;
  const { configured, supabase, userEmail } = await getAdminContext();
  let questions = quizQuestions;
  if (configured) {
    const { data } = await supabase.from("quiz_questions").select("id, position, prompt, explanation, active, options").order("position", { ascending: true });
    questions = (data as QuizQuestion[] | null) ?? [];
  }
  return <main className="admin-shell dashboard-shell">
    <header className="dashboard-header"><Link href="/" className="admin-brand"><span className="brand-mark small"><WalletCards size={22} /></span><span>Seu dinheiro<br /><b>no controle</b></span></Link><div className="admin-user"><span>{userEmail}</span></div></header>
    <section className="dashboard-content question-admin-content">
      <div className="questions-nav"><Link href="/admin"><ArrowLeft size={17} /> Voltar aos resultados</Link></div>
      {!configured && <div className="setup-banner"><CircleAlert size={20} /><div><b>Visualização de demonstração</b><p>As 16 questões podem ser conferidas abaixo. Configure o Supabase para liberar inclusão e edição com acesso administrativo protegido.</p></div></div>}
      {query.saved && <div className="success-banner"><Save size={18} /> Questão salva e publicada no quiz.</div>}
      {query.error && <div className="question-error"><CircleAlert size={18} /> Não foi possível salvar. Revise os campos ou a configuração do banco.</div>}
      <div className="dashboard-title questions-title"><div><p className="admin-kicker"><BookOpenCheck size={16} /> Conteúdo do quiz</p><h1>Gerenciar questões</h1><p>{questions.length} questões cadastradas. A posição define a ordem apresentada aos participantes.</p></div></div>
      <section className="question-manager">
        {questions.map((question) => <QuestionEditor key={question.id} question={question} disabled={!configured} />)}
      </section>
      <section className="new-question-panel">
        <div className="panel-heading"><div><h2><Plus size={18} /> Incluir nova questão</h2><p>Cadastre a situação, as três alternativas, as cores e a explicação.</p></div></div>
        <QuestionForm disabled={!configured} position={questions.length + 1} />
      </section>
    </section>
  </main>;
}

function QuestionEditor({ question, disabled }: { question: QuizQuestion; disabled: boolean }) {
  return <details className="question-editor"><summary><span>{String(question.position).padStart(2, "0")}</span><b>{question.prompt}</b><i className={question.active ? "active" : "inactive"}>{question.active ? "Ativa" : "Inativa"}</i></summary><QuestionForm question={question} position={question.position} disabled={disabled} /></details>;
}

function QuestionForm({ question, position, disabled }: { question?: QuizQuestion; position: number; disabled: boolean }) {
  const options = question?.options ?? [
    { id: "A" as const, text: "", color: "verde" as const },
    { id: "B" as const, text: "", color: "amarelo" as const },
    { id: "C" as const, text: "", color: "vermelho" as const },
  ];
  return <form action={saveQuestionAction} className="question-form"><fieldset disabled={disabled}>
    <input type="hidden" name="questionId" value={question?.id ?? ""} />
    <div className="question-form-row"><label className="position-field">Posição<input type="number" name="position" min="1" max="999" defaultValue={position} required /></label><label className="active-field"><input type="checkbox" name="active" defaultChecked={question?.active ?? true} /> Questão ativa</label></div>
    <label>Enunciado<textarea name="prompt" defaultValue={question?.prompt ?? ""} minLength={10} maxLength={600} rows={3} required /></label>
    <div className="admin-options">{options.map((option) => <div key={option.id} className="admin-option"><span>{option.id}</span><label>Alternativa<textarea name={`option${option.id}`} defaultValue={option.text} minLength={2} maxLength={500} rows={2} required /></label><label>Classificação<select name={`color${option.id}`} defaultValue={option.color}>{(Object.keys(colorLabels) as DecisionColor[]).map((color) => <option key={color} value={color}>{colorLabels[color]}</option>)}</select></label></div>)}</div>
    <label>Explicação exibida no gabarito<textarea name="explanation" defaultValue={question?.explanation ?? ""} minLength={10} maxLength={800} rows={3} required /></label>
    <button className="save-question" type="submit"><Save size={17} /> {question ? "Salvar alterações" : "Adicionar questão"}</button>
  </fieldset></form>;
}
