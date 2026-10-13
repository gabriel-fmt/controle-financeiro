"use client";

import type { PublicQuizQuestion, QuizAnswer, QuizEvaluation } from "@/types/quiz";
import {
  ArrowLeft, ArrowRight, BookOpenCheck, Check, ChevronRight, CircleAlert, CircleCheckBig,
  CircleHelp, Gamepad2, Lightbulb, ListChecks, RefreshCcw, ShieldCheck, Sparkles, Trophy,
  UsersRound, WalletCards,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type Stage = "welcome" | "identify" | "intro" | "quiz" | "result";
type ResultData = QuizEvaluation & { persisted: boolean; mode: "demo" | "database"; attemptNumber: number | null };

function createSessionId() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();

  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === "function") globalThis.crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function GameApp() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [loadError, setLoadError] = useState("");
  const [participantFirstName, setParticipantFirstName] = useState("");
  const [participantLastName, setParticipantLastName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const [resultError, setResultError] = useState("");

  const loadQuestions = () => {
    setLoadError("");
    void fetch("/api/questions", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar as perguntas.");
        const data = await response.json() as { questions?: PublicQuizQuestion[] };
        if (!data.questions?.length) throw new Error("Nenhuma pergunta ativa foi encontrada.");
        setQuestions(data.questions);
      })
      .catch((error: Error) => setLoadError(error.message));
  };

  useEffect(loadQuestions, []);

  const startGame = () => {
    const nextSessionId = createSessionId();
    setStage("identify"); setParticipantFirstName(""); setParticipantLastName("");
    setSessionId(nextSessionId); setQuestionIndex(0); setSelectedChoice(null);
    setAnswers([]); setResult(null); setResultError("");
  };

  const identifyParticipant = (firstName: string, lastName: string) => {
    setParticipantFirstName(firstName.trim().replace(/\s+/g, " "));
    setParticipantLastName(lastName.trim().replace(/\s+/g, " "));
    setStage("intro");
  };

  const beginQuiz = () => {
    if (!questions.length) return;
    setStartedAt(Date.now()); setQuestionIndex(0); setSelectedChoice(null); setAnswers([]); setStage("quiz");
  };

  const submitQuiz = async (finalAnswers: QuizAnswer[]) => {
    setStage("result"); setResult(null); setResultError("");
    try {
      const response = await fetch("/api/results", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId, participantFirstName, participantLastName,
          durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
          answers: finalAnswers,
        }),
      });
      const data = await response.json();
      if (!response.ok && response.status !== 202) throw new Error(data.error ?? "Não foi possível calcular o resultado.");
      setResult(data as ResultData);
    } catch (error) {
      setResultError(error instanceof Error ? error.message : "Não foi possível calcular o resultado.");
    }
  };

  const advanceQuestion = () => {
    if (!selectedChoice || !questions[questionIndex]) return;
    const answer = { questionId: questions[questionIndex].id, optionId: selectedChoice };
    const nextAnswers = [...answers.filter((item) => item.questionId !== answer.questionId), answer];
    setAnswers(nextAnswers); setSelectedChoice(null);
    if (questionIndex === questions.length - 1) void submitQuiz(nextAnswers);
    else setQuestionIndex((index) => index + 1);
  };

  return <main className="experience-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <section className={`phone-stage stage-${stage}`} aria-live="polite">
      {stage === "welcome" && <Welcome onStart={startGame} />}
      {stage === "identify" && <ParticipantForm onBack={() => setStage("welcome")} onContinue={identifyParticipant} />}
      {stage === "intro" && <Intro questionCount={questions.length} loading={!questions.length && !loadError} error={loadError} onRetry={loadQuestions} onBack={() => setStage("identify")} onNext={beginQuiz} />}
      {stage === "quiz" && questions[questionIndex] && <QuestionScreen question={questions[questionIndex]} index={questionIndex} total={questions.length} selectedChoice={selectedChoice} onChoose={setSelectedChoice} onAdvance={advanceQuestion} />}
      {stage === "result" && <ResultScreen participantName={`${participantFirstName} ${participantLastName}`} result={result} error={resultError} onRetry={() => void submitQuiz(answers)} onRestart={startGame} />}
    </section>
    <p className="desktop-note"><ShieldCheck size={15} /> Nome usado somente para identificar participantes e premiações.</p>
  </main>;
}

function AppHeader({ back, dark = false }: { back?: () => void; dark?: boolean }) {
  return <header className={`app-header ${dark ? "dark" : ""}`}>
    {back ? <button className="icon-button" type="button" onClick={back} aria-label="Voltar"><ArrowLeft size={21} /></button> : <span className="brand-mini"><WalletCards size={18} /> controle</span>}
    <span className="header-dots"><i /><i /><i /></span>
  </header>;
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <div className="screen welcome-screen"><AppHeader dark />
    <div className="welcome-content">
      <div className="hero-kicker"><Sparkles size={15} /> Quiz financeiro</div>
      <h1>Seu dinheiro<br />está no <span>controle…</span></h1>
      <h2>ou é ele que controla você?</h2>
      <p>Responda situações reais e descubra como você toma decisões financeiras.</p>
      <div className="quiz-hero-visual"><div className="hero-orbit" /><CircleHelp size={112} strokeWidth={1.55} /><Check className="quiz-check" size={58} /></div>
      <button className="hero-button" type="button" onClick={onStart}>Começar agora <ArrowRight size={20} /></button>
    </div>
    <div className="welcome-footer" aria-label="Etapas da experiência"><small>Neste quiz você vai</small><div><span>Ler</span><i /><span>Escolher</span><i /><span>Refletir</span></div></div>
  </div>;
}

function ParticipantForm({ onBack, onContinue }: { onBack: () => void; onContinue: (firstName: string, lastName: string) => void }) {
  const [firstName, setFirstName] = useState(""); const [lastName, setLastName] = useState("");
  const lastNameRef = useRef<HTMLInputElement>(null);
  const focusLastName = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    lastNameRef.current?.focus();
  };
  return <form className="screen light-screen participant-screen" onSubmit={(event) => { event.preventDefault(); onContinue(firstName, lastName); }}>
    <AppHeader back={onBack} />
    <div className="screen-body participant-body">
      <div className="participant-icon"><UsersRound /></div><p className="section-kicker">Sua participação</p><h1>Como podemos te identificar?</h1>
      <p className="lead">Informe seu nome para que o resultado apareça corretamente no painel da atividade.</p>
      <div className="participant-fields">
        <label>Nome<input name="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} onKeyDown={focusLastName} minLength={2} maxLength={50} autoComplete="given-name" enterKeyHint="next" placeholder="Ex.: Gabriel" required autoFocus /></label>
        <label>Sobrenome<input ref={lastNameRef} name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} minLength={2} maxLength={50} autoComplete="family-name" enterKeyHint="go" placeholder="Ex.: Silva" required /></label>
      </div>
      <div className="participant-privacy"><ShieldCheck size={20} /><p><b>Uso exclusivo da atividade</b>Seu nome será usado somente para identificar o resultado e organizar as premiações.</p></div>
    </div>
    <div className="bottom-action"><button className="primary-button" type="submit">Continuar <ArrowRight size={19} /></button></div>
  </form>;
}

function Intro({ questionCount, loading, error, onRetry, onBack, onNext }: { questionCount: number; loading: boolean; error: string; onRetry: () => void; onBack: () => void; onNext: () => void }) {
  return <div className="screen light-screen"><AppHeader back={onBack} /><div className="screen-body intro-body quiz-intro">
    <p className="section-kicker">Tomada de decisão</p><h1>Como funciona?</h1>
    <p className="lead">Você responderá {questionCount || 16} situações do cotidiano. Escolha a atitude que considera mais adequada.</p>
    <div className="how-list compact-how">
      <article><span><Gamepad2 /></span><div><b>Leia a situação</b><p>Pense no impacto da decisão antes de responder.</p></div></article>
      <article><span><ListChecks /></span><div><b>Escolha uma alternativa</b><p>Você pode trocar a resposta antes de avançar.</p></div></article>
      <article><span><Trophy /></span><div><b>Descubra seu resultado</b><p>Suas escolhas formam um perfil verde, amarelo ou vermelho.</p></div></article>
    </div>
    <div className="color-legend"><div className="verde"><CircleCheckBig /><span><b>Verde</b>Decisão consciente</span></div><div className="amarelo"><CircleAlert /><span><b>Amarelo</b>Pede mais atenção</span></div><div className="vermelho"><CircleAlert /><span><b>Vermelho</b>Decisão arriscada</span></div></div>
    {error && <div className="load-error"><CircleAlert /><span>{error}</span><button type="button" onClick={onRetry}>Tentar novamente</button></div>}
  </div><div className="bottom-action"><button className="primary-button" type="button" onClick={onNext} disabled={loading || Boolean(error)}>{loading ? "Carregando perguntas..." : "Começar perguntas"} <ArrowRight size={19} /></button></div></div>;
}

function QuestionScreen({ question, index, total, selectedChoice, onChoose, onAdvance }: { question: PublicQuizQuestion; index: number; total: number; selectedChoice: string | null; onChoose: (id: string) => void; onAdvance: () => void }) {
  const last = index === total - 1;
  return <div className="screen dark-screen quiz-screen">
    <div className="quiz-topbar"><span><BookOpenCheck size={21} /> Questão {index + 1} de {total}</span><b>{Math.round(((index + 1) / total) * 100)}%</b></div>
    <div className="progress-track"><i style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
    <div className="quiz-scroll">
      <div className="question-number">Situação {String(index + 1).padStart(2, "0")}</div>
      <h1>{question.prompt}</h1>
      <p className="question-hint">Escolha a alternativa que representa a atitude mais adequada.</p>
      <div className="quiz-options">{question.options.map((option) => {
        const active = selectedChoice === option.id;
        return <button key={option.id} type="button" className={active ? "quiz-option selected" : "quiz-option"} aria-pressed={active} onClick={() => onChoose(option.id)}><span className="option-letter">{option.id}</span><span>{option.text}</span>{active ? <Check size={21} /> : <ChevronRight size={21} />}</button>;
      })}</div>
      {selectedChoice ? <div className="answer-ready"><Check /><div><b>Resposta selecionada</b><p>Você ainda pode escolher outra alternativa antes de avançar.</p></div><button type="button" onClick={onAdvance}>{last ? "Ver meu resultado" : "Próxima questão"} <ArrowRight size={18} /></button></div> : <div className="quiz-tip"><Lightbulb /><p>Não é preciso fazer contas: avalie prioridades, riscos e consequências.</p></div>}
    </div>
  </div>;
}

const resultContent = {
  verde: { title: "Decisões conscientes", description: "Você demonstrou planejamento, responsabilidade e boa percepção dos riscos financeiros.", next: "Continue aplicando esse raciocínio e compartilhe o que aprendeu com outras pessoas." },
  amarelo: { title: "Atenção às escolhas", description: "Você reconhece boas práticas, mas algumas decisões ainda merecem uma análise mais cuidadosa.", next: "Antes de decidir, compare alternativas e pense no impacto para seus objetivos." },
  vermelho: { title: "Sinal de alerta", description: "Muitas escolhas podem comprometer sua segurança financeira ou aumentar o risco de endividamento.", next: "Comece separando necessidades de desejos e evite decisões tomadas por impulso." },
} as const;

function ResultScreen({ participantName, result, error, onRetry, onRestart }: { participantName: string; result: ResultData | null; error: string; onRetry: () => void; onRestart: () => void }) {
  if (error) return <div className="screen result-screen result-vermelho"><div className="result-body result-state"><CircleAlert size={66} /><h1>Não foi possível concluir</h1><p>{error}</p><button className="result-button" type="button" onClick={onRetry}>Tentar novamente</button></div></div>;
  if (!result) return <div className="screen result-screen result-amarelo"><div className="result-body result-state"><div className="result-loader" /><h1>Preparando seu resultado…</h1><p>Estamos conferindo todas as respostas.</p></div></div>;
  const content = resultContent[result.result];
  return <div className={`screen result-screen result-${result.result}`}>
    <div className="confetti"><i /><i /><i /><i /><i /><i /><i /><i /></div>
    <div className="result-body quiz-result-body"><p className="result-kicker">Resultado de {participantName}</p><h1>Seu perfil de decisão financeira é:</h1>
      <div className="trophy-wrap"><span className="trophy-glow" />{result.result === "verde" ? <Trophy size={92} /> : <CircleAlert size={88} />}</div>
      <div className="result-name">{content.title}</div><p className="result-description">{content.description}</p>
      <div className="quiz-score"><span><b>{result.score}</b> de {result.maxScore} pontos</span><strong>{result.percentage}%</strong></div>
      <div className="answer-breakdown"><div className="verde"><b>{result.greenCount}</b><span>Verdes</span></div><div className="amarelo"><b>{result.yellowCount}</b><span>Amarelas</span></div><div className="vermelho"><b>{result.redCount}</b><span>Vermelhas</span></div></div>
      <div className="next-step"><Lightbulb size={19} /><p><b>Próximo passo</b>{content.next}</p></div>
      {result.attemptNumber && <div className={`attempt-result ${result.attemptNumber === 1 ? "valid" : "repeat"}`}><b>{result.attemptNumber}ª tentativa</b><span>{result.attemptNumber === 1 ? "Esta é a tentativa válida para premiação." : "Resultado registrado como repetição. Para premiação, vale a primeira tentativa."}</span></div>}
      <p className="save-status">{result.persisted ? "Resultado salvo com segurança no painel." : "Modo demonstração: este resultado não foi salvo no painel."}</p>
      <button className="result-button" type="button" onClick={onRestart}><RefreshCcw size={18} /> Nova participação</button>
    </div>
  </div>;
}
