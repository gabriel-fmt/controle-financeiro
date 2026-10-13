import type { PublicQuizQuestion, QuizAnswer, QuizEvaluation, QuizQuestion } from "@/types/quiz";

export function toPublicQuestion(question: QuizQuestion): PublicQuizQuestion {
  return {
    id: question.id,
    position: question.position,
    prompt: question.prompt,
    active: question.active,
    options: question.options.map(({ id, text }) => ({ id, text })),
  };
}

export function evaluateQuiz(questions: QuizQuestion[], answers: QuizAnswer[]): QuizEvaluation {
  if (questions.length === 0 || answers.length !== questions.length) throw new Error("Respostas incompletas");
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.optionId]));
  const colors = questions.map((question) => {
    const option = question.options.find((item) => item.id === answerMap.get(question.id));
    if (!option) throw new Error("Resposta inválida");
    return option.color;
  });
  const greenCount = colors.filter((color) => color === "verde").length;
  const yellowCount = colors.filter((color) => color === "amarelo").length;
  const redCount = colors.filter((color) => color === "vermelho").length;
  const totalQuestions = questions.length;
  const score = greenCount * 2 + yellowCount;
  const maxScore = totalQuestions * 2;
  const percentage = Math.round((score / maxScore) * 100);
  const greenRate = greenCount / totalQuestions;
  const redRate = redCount / totalQuestions;
  const result = greenRate >= 0.8 && redRate <= 0.1
    ? "verde"
    : redRate >= 0.35 || greenRate < 0.4
      ? "vermelho"
      : "amarelo";
  return { result, score, maxScore, percentage, greenCount, yellowCount, redCount, totalQuestions };
}
